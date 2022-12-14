import { useEffect, useRef, useState } from 'react';
import styles from './EarningTracking.module.scss';

import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import ErrorPage from '../ErrorPage';
import EmptyPage from '../EmptyPage';

const cx = classNames.bind(styles);

function EarningTracking() {
    const { id } = useParams();

    const refFollow = useRef();
    const refStatistical = useRef();

    const [data, setData] = useState();
    const [data2, setData2] = useState();

    function format(n) {
        return n.toFixed(0).replace(/./g, function (c, i, a) {
            return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? '.' + c : c;
        });
    }

    useEffect(() => {
        if (localStorage.getItem('roll') == 2) {
            fetch(`http://localhost:5000/earning-tracking/getThuNhap/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    setData(data);
                });
            fetch(`http://localhost:5000/earning-tracking/getThongKe/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    setData2(data);
                });
        }
    }, []);

    return (
        <>
            {localStorage.getItem('roll') == 2 && (
                <>
                    <div className={cx('container', 'grid', 'link-block')}>
                        <div
                            className={cx('link')}
                            onClick={() => {
                                var linkBlock = document.querySelectorAll('.' + cx('link-block') + '>div');
                                linkBlock[0].classList.add(cx('link'));
                                linkBlock[1].classList.remove(cx('link'));
                                refFollow.current.style.display = 'block';
                                refStatistical.current.style.display = 'none';
                            }}
                        >
                            Theo d??i thu nh???p
                        </div>
                        <div
                            onClick={() => {
                                var linkBlock = document.querySelectorAll('.' + cx('link-block') + '>div');
                                linkBlock[0].classList.remove(cx('link'));
                                linkBlock[1].classList.add(cx('link'));
                                refFollow.current.style.display = 'none';
                                refStatistical.current.style.display = 'block';
                            }}
                        >
                            Th???ng k?? thu nh???p
                        </div>
                    </div>
                    <div className={cx('container', 'grid')} ref={refFollow}>
                        <div className={cx('title')}>
                            <h1>Theo d??i thu nh???p</h1>
                        </div>
                        {data !== undefined && data.length !== 0 && (
                            <div className={cx('content')}>
                                <div className={cx('content-wrapper')}>
                                    <table>
                                        <tr>
                                            <th>STT</th>
                                            <th>M?? ????n h??ng</th>
                                            <th>?????a ch??? nh???n</th>
                                            <th>?????a ch??? giao</th>
                                            <th>Ph?? v???n chuy???n</th>
                                        </tr>
                                        {data &&
                                            Object.keys(data).map(function (key) {
                                                return (
                                                    <tr key={key}>
                                                        <td>{parseInt(key) + 1}</td>
                                                        <td>{data[key].MaPhieuDatHang}</td>
                                                        <td>{data[key].dccn}</td>
                                                        <td>{data[key].dcgh}</td>
                                                        <td>{format(data[key].TongHoaDon)}</td>
                                                    </tr>
                                                );
                                            })}
                                    </table>
                                </div>
                            </div>
                        )}
                        {data !== undefined && data.length === 0 && <EmptyPage />}
                    </div>

                    <div className={cx('container', 'grid')} style={{ display: 'none' }} ref={refStatistical}>
                        <div className={cx('title')}>
                            <h1>Th???ng k?? thu nh???p</h1>
                        </div>
                        {data !== undefined && data.length !== 0 && (
                            <div className={cx('content')}>
                                <div className={cx('content-wrapper')}>
                                    <table>
                                        <tr>
                                            <th>STT</th>
                                            <th>Th??ng</th>
                                            <th>S??? l?????ng ????n h??ng</th>
                                            <th>Thu nh???p</th>
                                        </tr>
                                        {data2 &&
                                            Object.keys(data2).map(function (key) {
                                                return (
                                                    <tr key={key}>
                                                        <td>{parseInt(key) + 1}</td>
                                                        <td>{data2[key].thang}</td>
                                                        <td>{data2[key].sldh}</td>
                                                        <td>{format(data2[key].phi)}</td>
                                                    </tr>
                                                );
                                            })}
                                    </table>
                                </div>
                            </div>
                        )}
                        {data2 !== undefined && data2.length === 0 && <EmptyPage />}
                    </div>
                </>
            )}
            {!(localStorage.getItem('roll') == 2) && <ErrorPage />}
        </>
    );
}

export default EarningTracking;
