/* eslint-disable react/prop-types */
import { ConfigProvider, notification } from "antd";
import { createContext } from "react";


const AntContext = createContext()

const AntProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification({
        placement: "bottomRight"
    });
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#3B2416"
                }
            }}
        >
            <AntContext.Provider value={{ api }}>
                { contextHolder }
                { children }
            </AntContext.Provider>
        </ConfigProvider>
    );
}

export default AntProvider;