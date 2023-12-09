import dynamic from 'next/dynamic';

const AboutPromise = import('@/src/page-components/About').then(
    ({About}) => About,
);

const About = dynamic(async () => await AboutPromise, {ssr: false});

export default function AboutPage() {
    return <About />;
}
