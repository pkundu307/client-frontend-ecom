import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-4">
        {items.map((item, index) => (
          <span key={index}>
            {index > 0 && <span className="mx-2">/</span>}
            {index === items.length - 1 ? (
              <span className="font-semibold">{item.name}</span>
            ) : (
              <Link href={item.url} className="hover:text-gray-900">
                {item.name}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
