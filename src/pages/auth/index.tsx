import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { get } from "lodash";
import { useNavigate } from "react-router-dom";
import { req } from "@/services/api";

interface ILogin {
  username: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const mutateLogin = useMutation({
    mutationKey: ["mutateLogin"],
    mutationFn: (authParams: ILogin) => {
      return req({
        method: "POST",
        url: `/auth/login`,
        data: {
          ...authParams,
        },
      });
    },
  });

  const onFinish = async (values: ILogin) => {
    try {
      const res = await mutateLogin.mutateAsync(values);

      const accessToken = get(res, "data.data.accessToken", null);
      const refreshToken = get(res, "data.data.refreshToken", null);

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      navigate("/nasiya");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Form
        name="normal_login"
        className="w-1/4 flex flex-col"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Имя пользователя"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Пароль"
          />
        </Form.Item>

        <Form.Item>
          <Button
            loading={mutateLogin.status === "loading"}
            size="large"
            type="primary"
            htmlType="submit"
            block
          >
            Авторизоваться
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
