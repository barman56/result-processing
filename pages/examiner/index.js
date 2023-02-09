import DrawerLayout from "@/component/layout/drawerLayout";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { examinerPages } from "@/constants/routes";


const Home = () => {
  const {status, data } = useSession();
  if(status === 'unauthenticated'){
    Router.replace('auth/signin');
  }
  if(status ===  'authenticated'){
    return(
    <>
      <h1>Examiner page</h1>
    </>
    )
  }
  return(
  <h1>loading</h1>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <DrawerLayout pages={examinerPages}>
      <main>{page}</main>
    </DrawerLayout>
  )
}

  
export default Home;