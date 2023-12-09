import dynamic from 'next/dynamic';

const CategoryPromise = import('@/src/page-components/Category').then(
    ({Category}) => Category,
);

const Category = dynamic(async () => await CategoryPromise, {ssr: false});

export default function CategoryPage() {
    return <Category />;
}
