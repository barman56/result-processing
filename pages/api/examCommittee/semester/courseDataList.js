import pool from "@/lib/db";

export default async function handler(req, res) {
    const param = req.body;
    
    const query = {
        text: 'SELECT * FROM sem_course JOIN courses ON sem_course.course_code = courses.course_code WHERE courses.semester = $1 AND exam_session = $2::int ORDER By sem_course.course_code',
        values: [param.semester, param.session]
    }
    const result = await pool.query(query)
        .then(data => {res.status(200).send(data.rows)})
        .catch(err => console.log(err))
}
