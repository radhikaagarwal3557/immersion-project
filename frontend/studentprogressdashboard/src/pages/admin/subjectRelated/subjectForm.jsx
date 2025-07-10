import React, { useEffect, useState } from "react";
import {
    Button, TextField, Grid, Box,
    Typography, CircularProgress
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([
        { subName: "", subCode: "", sessions: "" }
    ]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: sclassName } = useParams();

    const { status, currentUser, response, error } = useSelector(state => state.user);
    const adminID = currentUser._id;
    const address = "Subject";

    // ------------------- Handlers -------------------

    const handleChange = (field, index) => (e) => {
        const updated = [...subjects];
        updated[index][field] = e.target.value;
        setSubjects(updated);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "", sessions: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        const updated = [...subjects];
        updated.splice(index, 1);
        setSubjects(updated);
    };

    const fields = {
        sclassName,
        subjects: subjects.map(subject => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions || 0,
        })),
        adminID,
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    // ------------------- useEffect -------------------

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl());
            setLoader(false);
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, dispatch, response]);

    // ------------------- JSX -------------------

    return (
        <form onSubmit={submitHandler}>
            <Box mb={2}>
                <Typography variant="h6">Add Subjects</Typography>
            </Box>
            <Grid container spacing={2}>
                {subjects.map((subject, index) => (
                    <React.Fragment key={index}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Subject Name"
                                variant="outlined"
                                value={subject.subName}
                                onChange={handleChange("subName", index)}
                                sx={styles.inputField}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Subject Code"
                                variant="outlined"
                                value={subject.subCode}
                                onChange={handleChange("subCode", index)}
                                sx={styles.inputField}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Sessions"
                                variant="outlined"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={subject.sessions}
                                onChange={handleChange("sessions", index)}
                                sx={styles.inputField}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end">
                                {index === 0 ? (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleAddSubject}
                                    >
                                        + Add Subject
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleRemoveSubject(index)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </React.Fragment>
                ))}

                <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loader}
                        >
                            {loader ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Popup
                message={message}
                showPopup={showPopup}
                setShowPopup={setShowPopup}
            />
        </form>
    );
};

export default SubjectForm;

const styles = {
    inputField: {
        '& .MuiInputLabel-root': {
            color: '#838080',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#838080',
        },
    },
};
