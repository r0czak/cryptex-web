export const API_CONFIG = {
  baseURL: import.meta.env.VITE_SPRING_BASE_API,
  endpoints: {
    public: import.meta.env.VITE_SPRING_PUBLIC_API,
    private: import.meta.env.VITE_SPRING_PRIVATE_API,
    admin: import.meta.env.VITE_SPRING_ADMIN_API,
  },
}
