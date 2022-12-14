import React, { useEffect, useRef, useState } from 'react';
import styles from './Item.module.scss';

import classNames from 'classnames/bind';
import Button from '~/components/Button';
import images from '~/assets/images';
import Text from '~/components/Text';
import Star from '~/components/Star';

const cx = classNames.bind(styles);

function Item({ children, data = {}, keyIndex = 0 }) {
    const [Price, setPrice] = useState(0);
    const [Sale, setSale] = useState(0);
    const [Name, setName] = useState('');

    const [comment, setComment] = useState();

    useEffect(() => {
        fetch(`http://localhost:5000/restaurant/getComment/${data.MaThucDon}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setComment(data);
            });
    }, []);

    const handleOnClickDelete = () => {
        fetch(`http://localhost:5000/branch/delete/${data.MaMonAn}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };
    const handleOnClickUpdatePrice = () => {
        console.log(data.MaMonAn);
        fetch(`http://localhost:5000/branch/updatePrice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                MaMonAn: data.MaMonAn,
                Gia: Price,
            }),
        });
    };
    const handleOnClickSaleOff = () => {
        fetch(`http://localhost:5000/branch/saleoff/${data.MaMonAn}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                PhanTram: Sale,
            }),
        });
    };
    const handleOnClickUpdateName = () => {
        fetch(`http://localhost:5000/branch/updateName/${data.MaMonAn}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                MaTD: data.MaThucDon,
                Ten: Name,
            }),
        });
    };
    function format(n) {
        return n.toFixed(0).replace(/./g, function (c, i, a) {
            return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? '.' + c : c;
        });
    }
    return (
        <>
            <div className={cx('item')}>
                <div className={cx('link')}>
                    <div className={cx('img')}>
                        <img src={images.product} alt="" />
                    </div>
                    <div className={cx('group')}>
                        <h6 className={cx('name')}>
                            <Text>{data && data.TenMonAn}</Text>
                        </h6>
                        <div className={cx('group-row')}>
                            <Text>{data && typeof data.Gia !== 'object' && format(data.Gia)}</Text>
                            <div className={cx('btn')}>
                                <Button className={cx('remove')} onClick={handleOnClickDelete}>
                                    X??a
                                </Button>
                                <Button data-toggle="modal" data-target={`#view${keyIndex}`}>
                                    Xem
                                </Button>
                                <Button data-toggle="modal" data-target={`#edit${keyIndex}`}>
                                    S???a
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                <div
                    className="modal fade "
                    id={`view${keyIndex}`}
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLongTitle"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" style={{ overflow: 'hidden' }}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('content')}>
                                    <div className={cx('close')} data-dismiss="modal" aria-label="Close">
                                        <img src={images.close} alt="" />
                                    </div>
                                </div>
                                <div className={cx('separate')}></div>
                                <div className={cx('item-modal')}>
                                    <div className={cx('link-modal')}>
                                        <div className={cx('img')}>
                                            <img src={images.product} alt="" />
                                        </div>
                                        <div className={cx('group')}>
                                            <h6 className={cx('name')}>
                                                <Text>{data && data.TenMonAn}</Text>
                                            </h6>
                                            <div className={cx('group-row')}>
                                                <Text>{data.Gia}</Text>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('separate-big')}></div>
                                <div className={cx('rating')}>
                                    {comment !== undefined &&
                                        Object.keys(comment).map((key) => {
                                            return (
                                                data.TenMonAn === comment[key].TenMonAn && (
                                                    <div className={cx('rating-item')} key={key}>
                                                        <Text>
                                                            <strong>T??n kh??ch h??ng:</strong> {comment[key].TenKhachHang}
                                                        </Text>
                                                        <Text>
                                                            <strong>B??nh lu???n:</strong> {comment[key].BinhLuan}
                                                        </Text>
                                                        <Text>
                                                            <Text style={{ marginRight: '8px' }}>
                                                                <strong>????nh gi??:</strong>
                                                            </Text>
                                                            <Star amount={comment[key].Rating} />
                                                        </Text>
                                                        <div className={cx('separate')}></div>
                                                    </div>
                                                )
                                            );
                                        })}
                                </div>
                                <div className={cx('footer')}>
                                    <div className={cx('btn-modal')} data-dismiss="modal" aria-label="Close">
                                        <div> Ho??n th??nh</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                <div
                    className="modal fade"
                    id={`edit${keyIndex}`}
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLongTitle"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" style={{ overflow: 'hidden' }}>
                            <div className={cx('content-wrapper')}>
                                <div className={cx('content')}>
                                    <div className={cx('close')} data-dismiss="modal" aria-label="Close">
                                        <img src={images.close} alt="" />
                                    </div>
                                </div>
                                <div className={cx('separate')}></div>
                                <div className={cx('item-modal')}>
                                    <div className={cx('link-modal')}>
                                        <div className={cx('img')}>
                                            <img src={images.product} alt="" />
                                        </div>
                                        <div className={cx('group')}>
                                            <div className={cx('text-input')}>
                                                <Text className={cx('text')}>T??n m??n ??n</Text>
                                                <input
                                                    type="text"
                                                    placeholder="????? tr???ng n???u kh??ng s???a"
                                                    value={Name}
                                                    name="name"
                                                    onChange={(e) => {
                                                        setName(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div
                                                className={cx('btn-modal')}
                                                data-dismiss="modal"
                                                aria-label="Close"
                                                onClick={() => handleOnClickUpdateName()}
                                            >
                                                <div>C???p nh???t t??n m??n</div>
                                            </div>
                                            <div className={cx('text-input')}>
                                                <Text className={cx('text')}>Gi??</Text>
                                                <input
                                                    type="text"
                                                    placeholder="????? tr???ng n???u kh??ng s???a"
                                                    value={Price}
                                                    onChange={(e) => {
                                                        setPrice(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div
                                                className={cx('btn-modal')}
                                                data-dismiss="modal"
                                                aria-label="Close"
                                                onClick={() => handleOnClickUpdatePrice()}
                                            >
                                                <div>C???p nh???t gi??</div>
                                            </div>
                                            <div className={cx('text-input')}>
                                                <Text className={cx('text')}>Khuy???n m??i</Text>
                                                <input
                                                    type="text"
                                                    placeholder="20% sale off nh???p 20"
                                                    value={Sale !== undefined && Sale}
                                                    onChange={(e) => {
                                                        setSale(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div
                                                className={cx('btn-modal')}
                                                data-dismiss="modal"
                                                aria-label="Close"
                                                onClick={() => handleOnClickSaleOff()}
                                            >
                                                <div>??p d???ng khuy???n m??i</div>
                                            </div>
                                            <div className={cx('text-input')}>
                                                <Text className={cx('text')}>M?? t???</Text>
                                                <input type="text" placeholder="????? tr???ng n???u kh??ng s???a" />
                                            </div>
                                            <div className={cx('text-input')}>
                                                <Text className={cx('text')}>H??nh ???nh</Text>
                                                <input className={cx('file')} type="file" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
            }
        </>
    );
}

export default Item;
