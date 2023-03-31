import { MdOutlinePlace } from 'react-icons/md';
import { AiOutlinePhone, AiOutlineMail } from 'react-icons/ai';
import { Row, Col } from 'antd';

import images from 'assets/images';
import Logo from './Logo';

function Footer() {
    const toTop = () => {
        window.scrollTo({
            top: 100,
            left: 100,
            behavior: 'smooth'
        });
    };
    return (
        <div className="shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)] mt-auto">
            <div className="container pt-4 pb-2">
                <div className="mt-4 mb-10">
                    <Row gutter={24}>
                        <Col span={6}>
                            <h2 className="font-medium text-lg">Follow our Socials</h2>
                            <div className="flex pt-4">
                                <div
                                    className="w-10 h-10 shadow-[0px_7px_29px_0px_#006fff87] rounded-full flex-center transition-all 
                                    duration-300 cursor-pointer hover:bg-[rgba(0,0,0,0.8)] hover:-translate-y-1"
                                >
                                    <img className="w-4 h-4" src={images.social.facebook} alt="facebook" />
                                </div>
                                <div
                                    className="w-10 h-10 shadow-[0px_7px_29px_0px_#006fff87] rounded-full flex-center ml-4 transition-all 
                                    duration-300 cursor-pointer hover:bg-[rgba(0,0,0,0.8)] hover:-translate-y-1"
                                >
                                    <img className="w-4 h-4" src={images.social.instagram} alt="instagram" />
                                </div>
                                <div
                                    className="w-10 h-10 shadow-[0px_7px_29px_0px_#006fff87] rounded-full flex-center ml-4 transition-all 
                                    duration-300 cursor-pointer hover:bg-[rgba(0,0,0,0.8)] hover:-translate-y-1"
                                >
                                    <img className="w-4 h-4" src={images.social.google} alt="google" />
                                </div>
                            </div>

                            <div className="flex items-center relative mt-4">
                                <Logo size={48} />
                                <span className="font-bold text-sm uppercase italic absolute left-6 top-6">
                                    Nike Shose
                                </span>
                            </div>
                        </Col>
                        <Col span={6}>
                            <h2 className="font-semibold text-lg">Company</h2>
                            <div className="pt-2 text-gray-500 font-medium">
                                <p className="mt-3">About Us</p>
                                <p className="mt-3">Press</p>
                                <p className="mt-3">Contact</p>
                            </div>
                        </Col>
                        <Col span={6}>
                            <h2 className="font-semibold text-lg">Introduce</h2>
                            <div className="pt-2 pr-6 text-gray-500 font-medium">
                                <p className="mt-3 flex items-center">
                                    <AiOutlinePhone className="mr-2" /> 0123789456
                                </p>
                                <p className="mt-3 flex items-center">
                                    <AiOutlineMail className="mr-2" /> lntthanh3317@gmail.com
                                </p>
                                <p className="mt-3 flex">
                                    <MdOutlinePlace className="mr-2 relative top-[2px]" />
                                    Đường 3/2, phường Xuân Khánh,
                                    <br /> quận Ninh Kiều, thành phố Cần Thơ
                                </p>
                            </div>
                        </Col>
                        <Col span={6}>
                            <h2 className="font-semibold text-lg">Support</h2>
                            <div className="pt-2 text-gray-500 font-medium">
                                <p className="mt-3">Submit a warranty claim</p>
                                <p className="mt-3">Submit a return request</p>
                                <p className="mt-3">
                                    Customer support: <span className="text-gray-800 ">lntthanh3317@gmail.com</span>
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>
                <span className="text-xs font-semibold pt-2 border-t border-gray-500" onClick={toTop}>
                    © Copyright 2022 By lntthanh3317
                </span>
            </div>
        </div>
    );
}

export default Footer;
