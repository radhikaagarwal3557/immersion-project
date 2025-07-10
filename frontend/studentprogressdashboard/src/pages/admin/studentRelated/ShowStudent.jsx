import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
  Box, Paper, IconButton, Button, ButtonGroup,
  Grow, Popper, ClickAwayListener, MenuList, MenuItem
} from '@mui/material';

import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';

import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

import { BlackButton, BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { studentsList, loading, error, response } = useSelector((state) => state.student);
  const { currentUser } = useSelector(state => state.user);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllStudents(currentUser._id));
    }
  }, [currentUser, dispatch]);

  const deleteHandler = (deleteID, address) => {
    setMessage("Delete function is currently disabled.");
    setShowPopup(true);

    // Enable when backend support ready
    // dispatch(deleteUser(deleteID, address)).then(() => {
    //   dispatch(getAllStudents(currentUser._id));
    // });
  };

  const studentColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    { id: 'sclassName', label: 'Class', minWidth: 170 },
  ];

  const studentRows = studentsList?.length > 0 && studentsList.map((student) => ({
    name: student.name,
    rollNum: student.rollNum,
    sclassName: student.sclassName?.sclassName || 'N/A',
    id: student._id,
  }));

  const StudentButtonHaver = ({ row }) => {
    const options = ['Take Attendance', 'Provide Marks'];
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = () => {
      if (selectedIndex === 0) {
        navigate(`/Admin/students/student/attendance/${row.id}`);
      } else {
        navigate(`/Admin/students/student/marks/${row.id}`);
      }
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) return;
      setOpen(false);
    };

    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Student")}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton variant="contained" onClick={() => navigate(`/Admin/students/student/${row.id}`)}>
          View
        </BlueButton>
        <ButtonGroup variant="contained" ref={anchorRef}>
          <Button onClick={handleClick}>{options[selectedIndex]}</Button>
          <BlackButton
            size="small"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </BlackButton>
        </ButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} transition disablePortal sx={{ zIndex: 1 }}>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  };

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: 'Add New Student',
      action: () => navigate("/Admin/addstudents"),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: 'Delete All Students',
      action: () => deleteHandler(currentUser._id, "Students")
    }
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {response ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <GreenButton variant="contained" onClick={() => navigate("/Admin/addstudents")}>
                Add Students
              </GreenButton>
            </Box>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
              {Array.isArray(studentRows) && studentRows.length > 0 ? (
                <TableTemplate
                  buttonHaver={StudentButtonHaver}
                  columns={studentColumns}
                  rows={studentRows}
                />
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>No students found.</Box>
              )}
              <SpeedDialTemplate actions={actions} />
            </Paper>
          )}
        </>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default ShowStudents;
