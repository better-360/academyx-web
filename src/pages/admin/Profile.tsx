import { useAppSelector } from "../../store/hooks";

export default function Profile() {
    const userData=useAppSelector((state)=>state.user.userData);
    return (
      <div>
        <h1>Setting Page</h1>
        <p>Adınız: {userData?.firstName}</p>
        <p>Soyadınız: {userData?.lastName}</p>
        <p>Kullanıcı Rolü {userData?.role}</p>
        <p>Şirketteki Rolü{userData?.companyRole}</p>
        <p></p>
      </div>
    );
  }
  