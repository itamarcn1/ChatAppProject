import React, { useState } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PersonAddIcon from '@mui/icons-material/PersonAddOutlined';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { AddChatModal } from '../AddChatModal/AddChatModal';
import GroupChatModal from '../GroupChatModal/GroupChatModal';
import { blue } from '@mui/material/colors';
import './addUserOrGroup.css';

export function AddUserOrGroup() {
  const [selection, setSelection] = useState('');
  const [openGroupChatModal, setOpenGroupChatModal] = useState(false);
  const [openAddChatModal, setOpenAddChatModal] = useState(false);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelection(selectedValue);

    if (selectedValue === 'groupChat') {
      setOpenGroupChatModal(true);
    } else if (selectedValue === 'singleChat') {
      setOpenAddChatModal(true);
    }
  };

  const closeModal = () => {
    setOpenGroupChatModal(false);
    setOpenAddChatModal(false);
    setSelection('');
  };

  return (
    <div>
      <FormControl variant="outlined" className="add-user-group-select">
        <Select
          value={selection}
          onChange={handleSelectChange}
          displayEmpty
          renderValue={() => <PersonAddIcon fontSize='large' color='success' />}
          className="select-input"
        >
          <MenuItem value="" disabled>
            <em>Select</em>
          </MenuItem>
          <MenuItem value="groupChat">
            <GroupAddIcon fontSize='large' color='secondary'/> New Group Chat
          </MenuItem>
          <MenuItem value="singleChat">
            <PersonAddAlt1Icon fontSize='large' sx={{ color: blue[300] }}/> Add Single Chat
          </MenuItem>
        </Select>
      </FormControl>
      {openGroupChatModal && (
        <GroupChatModal open={openGroupChatModal} handleClose={closeModal} />
      )}
      {openAddChatModal && (
        <AddChatModal open={openAddChatModal} handleClose={closeModal} />
      )}
    </div>
  );
}
