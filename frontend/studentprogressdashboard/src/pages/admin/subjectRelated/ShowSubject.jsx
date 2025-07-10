import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from "@mui/icons-material/Delete";

import {
    Paper, Box, IconButton
} from '@mui/material';

import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowSubjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { subjectsList, loading, error, response } = useSelector(state => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getSubjectList(currentUser._id, "AllSubjects"));
        }
    }, [currentUser._id, dispatch]);

    if (error) console.error(error);

    const deleteHandler = (deleteID, address) => {
        console.log("Delete Attempted for:", deleteID, address);
        setMessage("Sorry, the delete function is disabled for now.");
        setShowPopup(true);

        // Future: Uncomment to enable delete
        // dispatch(deleteUser(deleteID, address)).then(() => {
        //     dispatch(getSubjectList(currentUser._id, "AllSubjects"));
        // });
    };

    const subjectColumns = [
        { id: 'subName', label: 'Subject Name', minWidth: 150 },
        { id: 'sessions', label: 'Sessions', minWidth: 100 },
        { id: 'sclassName', label: 'Class Name', minWidth: 120 },
    ];

    const subjectRows = subjectsList?.map(subject => ({
        subName: subject.subName,
        sessions: subject.sessions,
        sclassName: subject.sclassName?.sclassName || "N/A",
        sclassID: subject.sclassName?._id,
        id: subject._id,
    }));

    const SubjectsButtonHaver = ({ row }) => (
        <>
            <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                <DeleteIcon color="error" />
            </IconButton>
            <BlueButton
                variant="contained"
                onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}
            >
                View
            </BlueButton>
        </>
    );

    const actions = [
        {
            icon: <PostAddIcon color="primary" />,
            name: 'Add New Subject',
            action: () => navigate("/Admin/subjects/chooseclass"),
        },
        {
            icon: <DeleteIcon color="error" />,
            name: 'Delete All Subjects',
            action: () => deleteHandler(currentUser._id, "Subjects"),
        },
    ];

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {response ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/subjects/chooseclass")}
                            >
                                Add Subjects
                            </GreenButton>
                        </Box>
                    ) : (
                        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
                            {Array.isArray(subjectsList) && subjectsList.length > 0 ? (
                                <TableTemplate
                                    buttonHaver={SubjectsButtonHaver}
                                    columns={subjectColumns}
                                    rows={subjectRows}
                                />
                            ) : (
                                <Box p={2} textAlign="center">
                                    No subjects available.
                                </Box>
                            )}
                            <SpeedDialTemplate actions={actions} />
                        </Paper>
                    )}
                </>
            )}
            <Popup message={message} showPopup={showPopup} setShowPopup={setShowPopup} />
        </>
    );
};

export default ShowSubjects;
