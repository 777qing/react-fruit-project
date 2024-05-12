import React, { useEffect, useState, useRef } from 'react'
import { Modal, Select, Form, Input, Radio, InputNumber, Image, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import request from '../../Service/request';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export default function FruitModule(props) {
  const { Option } = Select;
  const [form] = Form.useForm();
  const fruitRef = useRef()
  const [messageApi, contextHolder] = message.useMessage();
  let { modalTitle, isModalOpen, modalType, closeModal, fruit_module_form, getFruitsData } = props
  // console.log(fruit_module_form);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    fruitRef.current.setFieldsValue(fruit_module_form || {});
  }, [fruit_module_form])



  const onGenderChange = (value) => {
    console.log(value);
    form.setFieldsValue({
      category: value,
    });
  };

  /* 设置价格限制小数位数(小数点后面两位数)*/
  const limitDecimalPoint = value => {
    let reg = /^(-)*(\d+)\.(\d\d).*$/
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '').replace(reg, '$1$2.$3')
  }
  /* 设置价格过滤掉非数字的输入*/
  const priceFilterNoNum = value => {
    let reg = /^(-)*(\d+)\.(\d\d).*$/
    return value.replace(/[^\.\d]/g, '').replace(reg, '$1$2.$3')
  }

  const c_handleOk = () => {
    console.log(modalType);
    fruitRef.current.validateFields().then(data => {
      if (modalType === 'add') {
        let formData = new FormData();
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });
        // 发送 POST 请求
        fetch('http://127.0.0.1:8000/fruits/add', {
          method: 'POST',
          body: formData
        })
          .then(async response => {
            const data = await response.json(); // 等待 JSON 解析完成
            return { data, status: response.status }; // 返回包含数据和状态的对象
          })
          .then(res => {
            console.log(res);
            if (res.status == 200) {
              messageApi.open({
                type: 'success',
                content: '添加水果成功',
              });
              c_handleCancel()
              getFruitsData()
            } else {
              messageApi.open({
                type: 'warning',
                content: res.error,
              });

            }


          })
          .catch(error => {
            console.error('上传图片时出错:', error);
            messageApi.open({
              type: 'warning',
              content: error,
            });
          });

      } else if (modalType === 'edit') {
        request.post('/fruits/edit', { ...data, _id: fruit_module_form._id })
          .then(res => {
            if (res.status == 200) {
              messageApi.open({
                type: 'success',
                content: '编辑成功',
              });
              c_handleCancel()
              getFruitsData() 
            }else{
              messageApi.open({
                type: 'warning',
                content: res.error,
              });
            }
          })
          .catch(err => {
            messageApi.open({
              type: 'warning',
              content: err,
            });
          })
      }
    }).catch(errorInfo => {
      // 表单验证失败
    });
  }

  const c_handleCancel = () => {
    fruitRef.current.resetFields()
    setPreviewImage('')
    setFileList([])
    closeModal()

  };
  // 图片预览
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  // 已经上传的文件列表
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传
      </div>
    </button>
  );

  // 文件上传前的钩子
  const beforeUpload = (file) => {
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      fruitRef.current.setFieldsValue({
        fruit_img: file
      });

    };
    return false; // 阻止上传行为，达到预览图片的效果
  };

  const customRequest = (option) => {
    setTimeout(() => {
      // 模拟上传成功后更新 fileList
      setFileList([...fileList, { ...option.file, uid: Date.now() }]);
      setPreviewImage(option.file.url); // 设置预览图片为上传成功的图片
      console.log(fileList);
      fruitRef.current.setFieldsValue({
        fruit_img: fileList
      });
    }, 1000);
  };

  return (
    <div className='fruit_module'>
      {contextHolder}
      <Modal title={modalTitle} open={isModalOpen} onOk={c_handleOk} onCancel={c_handleCancel} forceRender={true}>
        <Form
          ref={fruitRef}
          labelCol={{
            span: 6,
          }}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
          form={form}
        >
          {modalType == 'add' &&
            <Form.Item label="水果主页图" name="fruit_img"
              rules={[
                {
                  required: true,
                  message: '请上传水果主页图!',
                },
              ]}>

              <div>
                <Upload
                  // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  customRequest={customRequest}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{
                      display: 'none',
                    }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
              </div>
            </Form.Item>
          }
          <Form.Item
            label="水果名称"
            name="fruit_name"
            rules={[
              {
                required: true,
                message: '请输入水果名称!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="类别"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onGenderChange}
              allowClear
            >
              <Option value="berry">浆果类</Option>
              <Option value="citrus">柑橘类</Option>
              <Option value="renguo">仁果类</Option>
              <Option value="drupe">核果类</Option>
              <Option value="melon">瓜类</Option>
            </Select>
          </Form.Item>

          <Form.Item label="是否特价" name='special'>
            <Radio.Group>
              <Radio value={true}> 是 </Radio>
              <Radio value={false}> 否 </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="价格"
            name="price"
            rules={[
              {
                required: true,
                message: '请输入价格!',
              },
            ]}
          >
            <InputNumber min={0} formatter={limitDecimalPoint}
              parser={priceFilterNoNum} />
          </Form.Item>

          <Form.Item
            label="原价格"
            name="old_price"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('special') === true && !value) {
                    return Promise.reject('请输入原价格!');
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <InputNumber min={0} formatter={limitDecimalPoint}
              parser={priceFilterNoNum} />
          </Form.Item>

          <Form.Item
            label="规格"
            name="specs"
            rules={[
              {
                required: true,
                message: '请输入水果规格!',
              },
            ]}
          >
            <Input />
          </Form.Item>



        </Form>
      </Modal>
    </div >
  )
}
