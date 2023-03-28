import { useEffect, useState } from 'react';
import { Upload } from 'antd';

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

function UploadImage({ thumbnail, setFormValue }) {
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        setFileList(state => {
            if (thumbnail) {
                return state.length
                    ? state
                    : [
                          ...state,
                          {
                              uid: '1',
                              thumbUrl: thumbnail.url
                          }
                      ];
            }
            return [];
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thumbnail]);

    const upload = async ({ onSuccess, file }) => {
        await convertBase64(file).then(data => {
            onSuccess('OK');
            setFormValue(state => ({ ...state, thumbnail: { thumbUrl: data } }));
        });
    };

    const remove = () => {
        setFormValue(state => ({ ...state, thumbnail: '' }));
    };

    return (
        <Upload
            listType="picture-card"
            customRequest={upload}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            onRemove={remove}
        >
            {fileList.length < 1 && '+ Upload'}
        </Upload>
    );
}

function UploadImageMultiple({ urlList, setFormValue }) {
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        setFileList(urlList.map(item => ({ url: item.url })));
    }, [urlList]);

    const upload = async ({ onSuccess, file }) => {
        await convertBase64(file).then(data => {
            onSuccess('OK');
            setFormValue(state => ({
                ...state,
                images: [...state.images, { uid: file.uid, url: data }]
            }));
        });
    };

    const remove = value => {
        setFormValue(state => ({
            ...state,
            images: state.images.filter(image => image.url !== value.url)
        }));
    };

    return (
        <Upload listType="picture-card" customRequest={upload} fileList={fileList} onRemove={remove} multiple>
            + Upload
        </Upload>
    );
}
export { UploadImage, UploadImageMultiple };
