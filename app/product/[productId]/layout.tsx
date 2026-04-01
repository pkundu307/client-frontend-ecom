// app/product/[productId]/layout.tsx
import { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{
    productSlug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { productSlug } = resolvedParams;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productSlug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Product not found');
    }

    const product = await response.json();

    return {
      title: `${product.title} - Buy Online at Best Price`,
      description: product.description.replace(/<[^>]*>/g, '').substring(0, 160),
      keywords: [product.title, product.category?.name || 'products', 'buy online', 'electronics', 'India', product.business?.name || 'shop'],
      openGraph: {
        title: product.title,
        description: product.description.replace(/<[^>]*>/g, '').substring(0, 200),
        images: [
          {
            url: product.images?.[0] || '/og-image.png',
            width: 800,
            height: 600,
            alt: product.title,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: product.description.replace(/<[^>]*>/g, '').substring(0, 200),
        images: [product.images?.[0] || '/og-image.png'],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${productSlug}`,
      },
      other: {
        'product:price:amount': product.variants?.[0]?.price || '0',
        'product:price:currency': 'INR',
        'product:availability': product.variants?.[0]?.stock > 0 ? 'in stock' : 'out of stock',
      },
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
