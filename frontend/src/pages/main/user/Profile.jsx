import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'antd';
import { useRef, useState } from 'react';
import { UploadImage } from 'components/comon/UploadImage';
import images from 'assets/images';
import userApi from 'api/userApi';
import { getUser } from 'redux/authSlice.js';
import LoadingOverlay from 'components/comon/loading/LoadingOverlay';

function Profile() {
    const userSelector = useSelector(state => state.auth.currentUser);
    const disaptch = useDispatch();

    const [user, setUser] = useState(userSelector);
    const [avatar, setAvatar] = useState(userSelector.avatar?.url || images.no_avatar);
    const [loading, setLoading] = useState(false);

    const inputImgRef = useRef();

    const convertBase64 = file => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = error => {
                reject(error);
            };
        });
    };

    const handleChoseImage = async e => {
        const value = e.target.files[0];
        const abc = await convertBase64(value);
        setAvatar(abc);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const data = Object.fromEntries(new FormData(document.getElementById('form_user')));
        if (avatar.slice(0, 4) !== 'http') {
            data.avatar = avatar;
        }
        try {
            const res = await userApi.update(user._id, data);
            disaptch(getUser(res.user));
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    return (
        <div className="border border-gray-400 rounded p-4">
            <h2 className="font-semibold text-xl">My profile</h2>
            <p className="text-sm pb-4 border-b border-gray-400">Manage profile information for account security</p>
            <Row>
                <Col span={16}>
                    <form className="p-6" id="form_user">
                        <div className="mb-8 relative">
                            <input
                                className="input w-full peer"
                                type="text"
                                name="fullname"
                                value={user.fullname}
                                placeholder=" "
                                onChange={e => setUser(user => ({ ...user, fullname: e.target.value }))}
                            />
                            <label className="label_top" htmlFor="fullname">
                                Fullname
                            </label>
                        </div>
                        <div className="mb-8 relative">
                            <input
                                className="input w-full peer"
                                type="text"
                                name="email"
                                value={user.email}
                                placeholder=" "
                                onChange={e => setUser(user => ({ ...user, email: e.target.value }))}
                            />
                            <label className="label_top" htmlFor="email">
                                Email
                            </label>
                        </div>
                        <div className="mb-8 relative">
                            <input
                                className="input w-full peer"
                                type="text"
                                name="phone"
                                value={user.phone}
                                placeholder=" "
                                onChange={e => setUser(user => ({ ...user, phone: e.target.value }))}
                            />
                            <label className="label_top" htmlFor="phone">
                                Phone
                            </label>
                        </div>
                        <button
                            type="sumbit"
                            onClick={handleSubmit}
                            className="px-5 py-2 rounded bg-[#5B8FB9] text-white cursor-pointer"
                        >
                            Save
                        </button>
                    </form>
                </Col>
                <Col span={8}>
                    <div
                        className="flex-center flex-col h-full cursor-pointer"
                        onClick={() => inputImgRef.current.click()}
                    >
                        <img src={avatar} alt="" className="w-32 h-32 rounded-full border border-gray-200" />
                        <input ref={inputImgRef} type="file" name="" id="" onChange={handleChoseImage} hidden />
                        <button className="mt-4 px-2 py-1 rounded bg-gray-600 text-white">Select image</button>
                    </div>
                </Col>
            </Row>
            {loading && <LoadingOverlay />}
        </div>
    );
}

export default Profile;
