import AddIcon from '@mui/icons-material/Add';
import { Alert, Backdrop, Box, Button, CircularProgress, Dialog, DialogTitle, Grow, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import AntDesignGrid from "../customDatagrid/customDatagrid";

const CATMdialog = (props) => {
    const { open, onClose, data, editableData, sx } = props;
    const [marks, setMarks] = useState([]);
    const [snackbar, setSnackbar] = useState(null);
    const [checked, setChecked] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(true);


    const getTotal = (params) => {
        if (params.row.ct || params.row.attendance) {
            return (+(params.row.ct ? params.row.ct : null)) + (+(params.row.attendance ? params.row.attendance : null))
        }
        return null;
    }

    const handleOnSubmit = async () => {
        marks.map((item) => {
            fetch('/api/courseTeacher/setMarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item, session: data.exam_session, course: data.course_code })
            })
        })

        fetch('/api/courseTeacher/updateInsert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ session: data.exam_session, course: data.course_code })
        })


        localStorage.removeItem(JSON.stringify(data) + 'catm')
        setSnackbar({ children: "Submitted Successfully", serverity: 'success' })
        onClose({ children: "Submitted Successfully", serverity: 'success' });
    }

    const handleCloseSnackbar = () => setSnackbar(null);

    const preProcessEditCellProps = (params) => {
        const hasError = isNaN(params.props.value)
        if (hasError) setSnackbar({ children: "Not A Number", serverity: 'error' })

        return { ...params.props, error: hasError };
    }

    const handleProcessRowUpdateError = () => {
        setSnackbar({ children: "Enter roll number", serverity: 'error' })
    };

    const updateMarks = (newRow) => {
        const temp = marks.map((item) => {
            if (item.roll === newRow.roll) {
                return newRow
            }
            else return item
        })
        setMarks(temp);
    }
    
    const ProcessRowUpdate = (newRow, oldRow) => {
        if(newRow.ct > 13.5 || newRow.attendance > 7.5){
            setSnackbar({children:"Out of Range number", serverity:'error'})
            return oldRow;
        }
        updateMarks(newRow);
        return newRow;
    }

    const columns = [
        {
            field: "no",
            headerName: "No",
            minWidth: 100,
            flex: 1,
            filterable: false,
            renderCell: (index) => index.api.getRowIndex(index.row.roll) + 1,
            flex:1
        },
        {
            field: "roll",
            headerName: "Roll No",
            minWidth: 100,
            flex: 1
        },
        {
            field: "name",
            headerName: "Student Name",
            minWidth: 200,
            flex: 1
        },
        {
            field: "ct",
            headerName: "ClassTest(13.5)",
            minWidth: 120,
            flex: 1,
            editable: editableData,
            preProcessEditCellProps
        },
        {
            field: "attendance",
            headerName: "Attendace(7.5)",
            minWidth: 120,
            flex: 1,
            editable: editableData,
            preProcessEditCellProps
        },
        {
            field: "total",
            headerName: "Total(32)",
            minWidth: 120,
            flex: 1,
            valueGetter: getTotal
        }
    ]

    const getMarks = async () => {
        await fetch('/api/courseTeacher/getMarks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ session: data.exam_session, course: data.course_code })
        })
            .then(res => res.json())
            .then(data => {
                const list = data.map(((item, idx) => {
                    return { no: idx + 1, ...item }
                }))

                setMarks(list);
            });
    }

    const getStudentID = async () => {
        await fetch('/api/courseTeacher/getstudents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ session: data.exam_session, semester: data.semester })
        })
            .then(res => res.json())
            .then(data => {
                const rolls = data.map((item) => {
                    return { roll: item.roll, name:item.name ,ct: null, attendance: null }
                })

                setMarks(rolls)
            })
    }

    useEffect(() => {
        if (!editableData) {
            getMarks()
            return;
        }
        const item = JSON.parse(localStorage.getItem(JSON.stringify(data) + 'catm'))
        if (item && item.length > 0) {
            if (item[0].roll != null)
                setMarks(item);
        }
        else if (marks.length < 1) {
            getStudentID();
        }
    }, [])


    useEffect(() => {
        if (editableData == true && marks.length > 0 && marks[0].roll != null && editableData) {
            localStorage.setItem(JSON.stringify(data) + 'catm', JSON.stringify(marks));
        }
    }, [marks])

    setTimeout(() => {
        setOpenBackdrop(false);
        setChecked(true)
    }, 500)


    return (
        <Dialog TransitionComponent={Grow} fullWidth maxWidth='md' open={open} onClose={() => onClose()} sx={{ ...sx, backdropFilter: 'blur(5px)' }} PaperProps={{ sx: { minHeight: 500 } }}>
            <DialogTitle sx={{ ml: 2 }}>Class Attendance and Test Marks</DialogTitle>
            <Box sx={{ ml: 5, mr: 5, mb: 3, display: 'flex', flexDirection: 'column' }}>
                {editableData && <Button variant='contained' sx={{ ml: 'auto', mb: 2 }} onClick={handleOnSubmit}>Submit</Button>}
                <AntDesignGrid
                    sx={{ boxShadow: 3 }}
                    getRowId={row => row.roll}
                    autoHeight
                    columns={columns}
                    rows={marks}
                    checked={checked}
                    experimentalFeatures={{ newEditingApi: true }}
                    processRowUpdate={ProcessRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                />
            </Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {!!snackbar && (
                <Snackbar
                    open
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={handleCloseSnackbar}
                    autoHideDuration={3000}
                >
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </Dialog>
    )

}

export default CATMdialog;