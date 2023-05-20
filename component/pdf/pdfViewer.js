import { PDFViewer } from "@react-pdf/renderer/lib/react-pdf.browser.cjs.js"
import { useEffect, useState } from "react"
import TabulationPDF from "./tabulation_pdf"



const TabulationView = ({session, semester, courseList, memberList}) => {
    const [client, setClient] = useState(false)

    return(
        <PDFViewer style={{ 
            display: 'flex',
            alignSelf: 'center',
            justifySelf: 'center',
            width: '100vw', 
            height: '100vh' 
            }}>
            <TabulationPDF session={session} semester={semester} courseList = {courseList} memberList = {memberList}/>
        </PDFViewer>
    )
}

export default TabulationView