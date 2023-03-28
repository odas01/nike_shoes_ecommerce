import { useEffect, useRef } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Row, Col } from 'antd';

import Card from 'components/comon/Card';

function Catalog({ products, loading, loadMore, skip, setSkip, setLoadMore, defaultLimit = 15 }) {
    const listRef = useRef(null);
    useEffect(() => {
        const onScroll = () => {
            const valid =
                window.innerHeight + parseInt(document.documentElement.scrollTop) - 100 > listRef.current?.clientHeight;
            if (!loadMore && valid) {
                setLoadMore(true);
                setSkip(skip + defaultLimit);
            }
        };

        // clean up code
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadMore, skip]);

    return (
        <>
            {loading && !loadMore && (
                <div className="flex-center">
                    <AiOutlineLoading3Quarters size={24} className="animate-spin" />
                </div>
            )}
            {products.length > 0 && (
                <div ref={listRef}>
                    <Row gutter={[12, 18]}>
                        {products.map((product, index) => (
                            <Col key={index} span={6}>
                                <Card data={product} size={16} />
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {loading && loadMore && (
                <div className="flex-center">
                    <AiOutlineLoading3Quarters size={24} className="animate-spin" />
                </div>
            )}
        </>
    );
}

export default Catalog;
