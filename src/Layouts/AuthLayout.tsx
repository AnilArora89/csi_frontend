import useTokenStore from "@/store"
import { Navigate, Outlet } from "react-router-dom"
const AuthLayout = () => {
  const Token = useTokenStore(state => state.token)
  if(Token){
    return <Navigate to='/dashboard/home' replace />
    }
  return (
    <>
      <Outlet/>
    </>
  )
}

export default AuthLayout

