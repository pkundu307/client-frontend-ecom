import React, { useState, useEffect, useMemo, useCallback } from "react";
import type { Variant, AttributeOption } from "../../hooks/useProductDetails";

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onVariantChange: (variant: Variant) => void;
}

export default function VariantSelector({ variants, selectedVariant, onVariantChange }: VariantSelectorProps) {
  const allAttributeGroups = useMemo(() => {
    const allAttributesMap = variants.reduce((acc, variant) => {
      variant.attributeValues.forEach(({ attribute, attributeOption }) => {
        if (!acc[attribute.id]) {
          acc[attribute.id] = {
            attributeName: attribute.name,
            options: new Map<number, AttributeOption>(),
          };
        }
        acc[attribute.id].options.set(attributeOption.id, attributeOption);
      });
      return acc;
    }, {} as { [attributeId: number]: { attributeName: string; options: Map<number, AttributeOption> } });

    return Object.values(allAttributesMap)
      .map((group) => ({
        name: group.attributeName,
        options: Array.from(group.options.values()).sort((a, b) => a.value.localeCompare(b.value)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [variants]);

  const [currentSelections, setCurrentSelections] = useState<{ [attributeName: string]: number | null }>({});

  useEffect(() => {
    if (selectedVariant) {
      const newSelections: { [attributeName: string]: number | null } = {};
      selectedVariant.attributeValues.forEach((av) => {
        newSelections[av.attribute.name] = av.attributeOption.id;
      });
      setCurrentSelections(newSelections);
    } else {
      setCurrentSelections({});
    }
  }, [selectedVariant]);

  const findBestMatchingVariant = useCallback(
    (selectionIds: { [attributeName: string]: number | null }): Variant | null => {
      let bestMatch: Variant | null = null;
      let bestMatchCount = -1;
      let bestScore = -1;

      for (const variant of variants) {
        let currentMatchCount = 0;
        let isValidCandidate = true;
        const currentVariantAttrMap = new Map<string, number>();
        variant.attributeValues.forEach((av) => currentVariantAttrMap.set(av.attribute.name, av.attributeOption.id));

        for (const [attrName, selectedOptionId] of Object.entries(selectionIds)) {
          if (selectedOptionId !== null) {
            if (currentVariantAttrMap.get(attrName) === selectedOptionId) {
              currentMatchCount++;
            } else {
              isValidCandidate = false;
              break;
            }
          }
        }

        if (!isValidCandidate) continue;

        let currentScore = 0;
        if (variant.status === "ACTIVE") currentScore += 100;
        if (variant.isDefault) currentScore += 50;
        if (variant.stock > 0) currentScore += 20;

        if (currentMatchCount > bestMatchCount) {
          bestMatchCount = currentMatchCount;
          bestScore = currentScore;
          bestMatch = variant;
        } else if (currentMatchCount === bestMatchCount) {
          if (currentScore > bestScore) {
            bestScore = currentScore;
            bestMatch = variant;
          }
        }
      }

      if (!bestMatch && variants.length > 0) {
        bestMatch =
          variants.find((v) => v.isDefault && v.status === "ACTIVE" && v.stock > 0) ||
          variants.find((v) => v.status === "ACTIVE" && v.stock > 0) ||
          variants.find((v) => v.status === "ACTIVE") ||
          variants.find((v) => v.isDefault) ||
          variants[0] ||
          null;
      }

      return bestMatch;
    },
    [variants]
  );

  const checkIsOptionEnabled = useCallback(
    (attrNameBeingChecked: string, optionIdBeingChecked: number, baseSelections: { [attributeName: string]: number | null }): boolean => {
      const potentialSelectionsForCheck = { ...baseSelections, [attrNameBeingChecked]: optionIdBeingChecked };
      return variants.some((variant) => {
        const variantAttrMap = new Map<string, number>();
        variant.attributeValues.forEach((av) => variantAttrMap.set(av.attribute.name, av.attributeOption.id));
        return Object.entries(potentialSelectionsForCheck).every(([attrName, selectedOptionId]) => {
          if (selectedOptionId === null) return true;
          return variantAttrMap.get(attrName) === selectedOptionId;
        });
      });
    },
    [variants]
  );

  const handleAttributeChange = useCallback(
    (attributeName: string, option: AttributeOption) => {
      const isCurrentlySelected = currentSelections[attributeName] === option.id;
      const newClickedSelectionId = isCurrentlySelected ? null : option.id;

      const updatedSelections: { [attributeName: string]: number | null } = {
        ...currentSelections,
        [attributeName]: newClickedSelectionId,
      };

      for (const attrGroup of allAttributeGroups) {
        const otherAttrName = attrGroup.name;
        if (otherAttrName === attributeName) continue;
        const otherSelectedOptionId = updatedSelections[otherAttrName];
        if (otherSelectedOptionId !== null) {
          const isOtherOptionStillEnabled = checkIsOptionEnabled(otherAttrName, otherSelectedOptionId, updatedSelections);
          if (!isOtherOptionStillEnabled) {
            updatedSelections[otherAttrName] = null;
          }
        }
      }

      setCurrentSelections(updatedSelections);
      const bestVariant = findBestMatchingVariant(updatedSelections);

      if (bestVariant) {
        onVariantChange(bestVariant);
      } else if (variants.length > 0) {
        const fallbackVariant: Variant | null =
          variants.find((v) => v.isDefault && v.status === "ACTIVE" && v.stock > 0) ||
          variants.find((v) => v.status === "ACTIVE" && v.stock > 0) ||
          variants.find((v) => v.isDefault) ||
          variants[0] ||
          null;
        if (fallbackVariant) {
          onVariantChange(fallbackVariant);
        }
      }
    },
    [currentSelections, allAttributeGroups, checkIsOptionEnabled, findBestMatchingVariant, variants, onVariantChange]
  );

  const getIsOptionEnabledForRender = useCallback(
    (attrName: string, optionId: number): boolean => {
      return checkIsOptionEnabled(attrName, optionId, currentSelections);
    },
    [checkIsOptionEnabled, currentSelections]
  );

  if (allAttributeGroups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {allAttributeGroups.map(({ name: attributeName, options }) => {
        const currentSelectedOptionId = currentSelections[attributeName];
        const currentSelectedOption = options.find((o) => o.id === currentSelectedOptionId);

        return (
          <div key={attributeName}>
            <h4 className="font-medium text-gray-900 mb-3 capitalize">
              {attributeName}: <span className="text-[var(--royal-gold)]">{currentSelectedOption?.value || "Select"}</span>
            </h4>
            <div className="flex flex-wrap gap-3">
              {options.map((option) => {
                const isSelected = currentSelectedOptionId === option.id;
                const isEnabled = getIsOptionEnabledForRender(attributeName, option.id);

                const variantForOption = isEnabled ? findBestMatchingVariant({ ...currentSelections, [attributeName]: option.id }) : null;
                const isOutOfStock = variantForOption && variantForOption.stock <= 0;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAttributeChange(attributeName, option)}
                    disabled={!isEnabled}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all capitalize relative ${
                      isSelected
                        ? "border-gray-800 bg-gray-800 text-white shadow-md"
                        : isEnabled
                        ? isOutOfStock
                          ? "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed line-through"
                          : "border-gray-300 bg-white/40 hover:border-gray-600 text-gray-700 backdrop-blur-xl"
                        : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                    style={
                      isSelected
                        ? { boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.2)" }
                        : isEnabled && !isOutOfStock
                        ? { boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(255, 255, 255, 0.1)" }
                        : {}
                    }
                    aria-pressed={isSelected}
                    aria-label={`${attributeName} ${option.value}`}
                  >
                    {option.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
