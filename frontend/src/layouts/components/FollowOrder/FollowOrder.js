import styles from './FollowOrder.module.scss';

import classNames from 'classnames/bind';
import images from '~/assets/images';
import Button from '~/components/Button';
import Text from '~/components/Text';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from '../ErrorPage';

const cx = classNames.bind(styles);

function FollowOrder() {
    const [data, setData] = useState();
    const { id } = useParams();

    function format(n) {
        return n.toFixed(0).replace(/./g, function (c, i, a) {
            return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? '.' + c : c;
        });
    }

    useEffect(() => {
        if (localStorage.getItem('roll') == 4) {
            fetch(`http://localhost:5000/follow-order/getDonHang/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    setData(data);
                });
        }
    }, [id]);

    const [name, setName] = useState();
    const [listMonAn, setListMonAn] = useState();
    const [keyIndex, setKeyIndex] = useState(-1);

    const hanldeOnClickDetail = (pdh) => {
        fetch('http://localhost:5000/follow-order/getTenKH', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ pdh: pdh }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setName(data);
            });
        fetch('http://localhost:5000/follow-order/getDetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ pdh: pdh }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setListMonAn(data);
            });
    };

    const [comment, setComment] = useState(false);
    const [commentContent, setCommentContent] = useState({
        binhluan: '',
        danhgia: 0,
        tenmonan: '',
        mamonan: '',
        ma: localStorage.getItem('ma'),
    });

    return (
        <>
            {localStorage.getItem('roll') == 4 && (
                <>
                    <div className={cx('container', 'grid')}>
                        <div className={cx('title')}>
                            <h1>Theo d??i ????n ?????t h??ng</h1>
                        </div>
                        <div className={cx('content')}>
                            <div className={cx('content-wrapper')}>
                                <table>
                                    <tr>
                                        <th>STT</th>
                                        <th>M?? ????n h??ng</th>
                                        <th>Th??nh ti???n</th>
                                        <th>Tr???ng th??i</th>
                                        <th>Chi ti???t</th>
                                        <th>H???y ????n h??ng</th>
                                    </tr>
                                    {data &&
                                        Object.keys(data).map(function (key) {
                                            return (
                                                <tr key={key}>
                                                    <td>{parseInt(key) + 1}</td>
                                                    <td>{data[key].MaPhieuDatHang}</td>
                                                    <td>{format(data[key].TongHoaDon)}</td>
                                                    <td>{data[key].TinhTrangDonHang}</td>
                                                    <td
                                                        className={cx('more')}
                                                        data-toggle="modal"
                                                        data-target="#more"
                                                        onClick={() => {
                                                            hanldeOnClickDetail(data[key].MaPhieuDatHang);
                                                            setKeyIndex(parseInt(key));
                                                            setCommentContent({
                                                                binhluan: '',
                                                                danhgia: 0,
                                                                tenmonan: '',
                                                                mamonan: '',
                                                                ma: localStorage.getItem('ma'),
                                                            });
                                                            setComment(false);
                                                        }}
                                                    >
                                                        Chi ti???t
                                                    </td>
                                                    {data[key].TinhTrangDonHang === 'Ch??? nh???n' && (
                                                        <td
                                                            className={cx('more')}
                                                            onClick={() => {
                                                                fetch(
                                                                    'http://localhost:5000/follow-order/deleteOrder',
                                                                    {
                                                                        method: 'POST',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                            Accept: 'application/json',
                                                                        },
                                                                        body: JSON.stringify({
                                                                            pdh: data[key].MaPhieuDatHang,
                                                                        }),
                                                                    },
                                                                )
                                                                    .then((res) => {
                                                                        return res.json();
                                                                    })
                                                                    .then((data) => {
                                                                        console.log(data);
                                                                    });
                                                            }}
                                                        >
                                                            H???y ????n h??ng
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                </table>
                            </div>
                        </div>
                    </div>
                    <div
                        className="modal fade"
                        id="more"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="exampleModalLongTitle"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content" style={{ overflow: 'hidden' }}>
                                <div className={cx('content-wrapper-modal')}>
                                    <div className={cx('content')}>
                                        <div className={cx('close')} data-dismiss="modal" aria-label="Close">
                                            <img src={images.close} alt="" />
                                        </div>
                                    </div>
                                    <div className={cx('separate')}></div>
                                    <div className={cx('item-modal')}>
                                        <Text>
                                            <strong>M?? ????n h??ng: </strong>
                                            {data && keyIndex !== -1 && `${data[keyIndex].MaPhieuDatHang}`}
                                        </Text>
                                        <Text>
                                            <strong>T??n kh??ch h??ng: </strong>
                                            {name && name[0].TenKhachHang}
                                        </Text>
                                        <Text>
                                            <strong>?????a ch???: </strong>
                                            {name && `${name[0].dcgh}`}
                                        </Text>
                                    </div>
                                    <div className={cx('separate')}></div>
                                    <div className={cx('item-modal')}>
                                        <Text>
                                            <strong>M??n ???????c ?????t:</strong>
                                        </Text>
                                        {listMonAn &&
                                            Object.keys(listMonAn).map(function (key) {
                                                return (
                                                    <div key={key} className={cx('dish')}>
                                                        <Text className={cx('name-dish')}>
                                                            {listMonAn[key].TenMonAn}{' '}
                                                            <Button
                                                                className={cx('btn')}
                                                                onClick={(e) => {
                                                                    setComment(true);
                                                                    setCommentContent((pre) => ({
                                                                        ...pre,
                                                                        tenmonan: listMonAn[key].TenMonAn,
                                                                        mamonan: listMonAn[key].MaMonAn,
                                                                    }));
                                                                }}
                                                            >
                                                                B??nh lu???n
                                                            </Button>
                                                        </Text>
                                                        <Text className={cx('price-dish')}>
                                                            {listMonAn[key].SoLuongMonAn} x{' '}
                                                            {format(parseInt(listMonAn[key].Gia))}
                                                        </Text>
                                                    </div>
                                                );
                                            })}

                                        <div className={cx('dish')}>
                                            <Text className={cx('name-dish')}>
                                                <strong>T???ng ti???n</strong>
                                            </Text>
                                            <Text className={cx('price-dish')}>
                                                {data && keyIndex !== -1 && format(parseInt(data[keyIndex].TongHoaDon))}
                                            </Text>
                                        </div>
                                    </div>
                                    {comment && (
                                        <>
                                            <div className={cx('separate')}></div>
                                            <div className={cx('comment')}>
                                                <Text className={cx('title-comment')}>
                                                    B??nh lu???n m??n: {commentContent.tenmonan}
                                                </Text>
                                                <input
                                                    className={cx('input-comment')}
                                                    type="text"
                                                    value={commentContent.binhluan}
                                                    onChange={(e) => {
                                                        if (e.target.value.length <= 100)
                                                            setCommentContent((pre) => ({
                                                                ...pre,
                                                                binhluan: e.target.value,
                                                            }));
                                                    }}
                                                />
                                                <input
                                                    className={cx('input-comment')}
                                                    type="number"
                                                    value={commentContent.danhgia}
                                                    onChange={(e) => {
                                                        if (e.target.value <= 5 && e.target.value >= 0)
                                                            setCommentContent((pre) => ({
                                                                ...pre,
                                                                danhgia: e.target.value,
                                                            }));
                                                    }}
                                                />
                                                <Button
                                                    className="btn btn-primary btn-block mb-4"
                                                    style={{ backgroundColor: 'var(--primary-color)' }}
                                                    onClick={() => {
                                                        fetch('http://localhost:5000/follow-order/submit', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                Accept: 'application/json',
                                                            },
                                                            body: JSON.stringify(commentContent),
                                                        })
                                                            .then((res) => {
                                                                return res.json();
                                                            })
                                                            .then((data) => {
                                                                setCommentContent({
                                                                    binhluan: '',
                                                                    danhgia: 0,
                                                                    tenmonan: '',
                                                                    mamonan: '',
                                                                    ma: localStorage.getItem('ma'),
                                                                });
                                                                setComment(false);
                                                            });
                                                    }}
                                                >
                                                    B??nh lu???n
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    <div className={cx('separate-big')}></div>
                                    <div className={cx('footer')}>
                                        <div className={cx('btn-modal')} data-dismiss="modal" aria-label="Close">
                                            <div> Ho??n th??nh</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {!(localStorage.getItem('roll') == 4) && <ErrorPage />}
        </>
    );
}

export default FollowOrder;
