import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const {isReady} = router;
        if (isReady) {
            void router.replace('/login');
        }
    }, [router]);

    return null;
}
