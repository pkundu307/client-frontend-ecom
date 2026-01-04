import { Metadata } from 'next';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ categoryid: string }> 
}): Promise<Metadata> {
  const { categoryid } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/category-page/${categoryid}?page=1&limit=1`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }

    const data = await response.json();
    const categoryName = data.category?.name || 'Products';

    return {
      title: `${categoryName} - Shop Best ${categoryName} Online`,
      description: `Explore wide range of ${categoryName} with best prices. Free shipping on orders above ₹499. Shop now!`,
      keywords: [categoryName, `buy ${categoryName}`, 'online shopping', 'electronics', 'India'],
      openGraph: {
        title: `Shop ${categoryName} Online`,
        description: `Best ${categoryName} collection with great offers`,
        images: [{ url: '/og-category.png' }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Shop ${categoryName} Online`,
        description: `Best ${categoryName} collection with great offers`,
        images: ['/og-category.png'],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${categoryid}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: 'Category - Shop Online',
      description: 'Browse our product categories',
    };
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
