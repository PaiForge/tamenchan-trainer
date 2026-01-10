import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // react-native を空のモジュールにエイリアス（Web版では不要）
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native": isServer ? false : "react-native-web",
    };

    return config;
  },
};

export default nextConfig;
