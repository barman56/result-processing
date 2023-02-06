import { useSession } from "next-auth/react";
import Router from "next/router";
import ExaminerLayout from "@/component/layout/examinerLayout";
import Layout from "@/component/layout/layout";

const Home = () => {
  const {status, data } = useSession();
  if(status === 'unauthenticated'){
    Router.replace('auth/signin');
  }
  if(status ===  'authenticated'){
    return(
    <>
      <h1>Examiner page</h1>
      <h1>Examiner page</h1>
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
      <ExaminerLayout>
      <main>{page}</main>
      </ExaminerLayout>
   
  )
}

  
export default Home;