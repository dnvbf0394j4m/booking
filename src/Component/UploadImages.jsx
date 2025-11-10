import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Image, Modal, Upload } from "antd";
import { useState } from "react";

export default function UploadImages() {

  const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState([]);


      const [previewOpen, setPreviewOpen] = useState(false);
      const [previewImage, setPreviewImage] = useState('');
    
      const showModal = () => {
        setIsModalOpen(true);
      };
      const handleOk = () => {
        setIsModalOpen(false);
      };
      const handleCancel = () => {
        setIsModalOpen(false);
      };


      const formData = new FormData();
        // Append nhiều ảnh
      fileList.forEach((file) => {

        if (file.originFileObj) {
          formData.append("images", file.originFileObj); // key "images" khớp @RequestParam("images")
        }
      });


      
  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };


    return (
        <>
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal
                title="Basic Modal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}


                styles={{
                    content: {
                        height: 500,              // 👈 modal cố định cao 500px
                        display: "flex",
                        flexDirection: "column",  // giữ layout header - body - footer
                    },
                    body: {
                        flex: 1,                  // chiếm hết phần còn lại
                        overflowY: "auto",        // scroll riêng body
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE + Edge cũ
                    },
                }}
            >
                <Form.Item label="Hình ảnh" name="upload">
                    <Upload
                        multiple
                        beforeUpload={() => false}
                        showUploadList={false} // ✅ chỉ giữ nút Upload
                        onChange={({ fileList }) => setFileList(fileList)}
                    >
                        <Button icon={<UploadOutlined />}>Upload ảnh</Button>
                    </Upload>
                </Form.Item>

                {/* Danh sách ảnh scroll riêng */}
                <div
                    style={{
                        // maxHeight: 500,
                        // overflowY: "auto",
                        border: "1px solid #f0f0f0",
                        padding: 8,
                        borderRadius: 8,
                    }}
                >
                    <Image.PreviewGroup
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                        }}
                    >
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            {fileList.map((file) => {
                                const src = file.originFileObj
                                    ? URL.createObjectURL(file.originFileObj)
                                    : file.url;

                                return (
                                    <div
                                        key={file.uid}
                                        style={{
                                            position: "relative",
                                            width: 120,
                                            border: "1px solid #ddd",
                                            borderRadius: 8,
                                            padding: 8,
                                            textAlign: "center",
                                        }}
                                    >
                                        {/* Ảnh hiển thị + preview */}
                                        <Image
                                            src={src}
                                            width={100}
                                            height={80}
                                            style={{ objectFit: "cover", borderRadius: 4 }}
                                            onClick={() => {
                                                setPreviewImage(src);
                                                setPreviewOpen(true);
                                            }}
                                        />

                                        {/* Nút xoá */}
                                        <Button
                                            type="text"
                                            size="small"
                                            danger
                                            icon={<UploadOutlined />}
                                            onClick={() =>
                                                setFileList(fileList.filter((item) => item.uid !== file.uid))
                                            }
                                            style={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                                background: "rgba(255,255,255,0.7)",
                                                borderRadius: "50%",
                                            }}
                                        />

                                        {/* Tên file */}
                                        <div
                                            style={{
                                                fontSize: 12,
                                                marginTop: 4,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {file.name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Image.PreviewGroup>
                </div>
            </Modal>

        </>
    )
}