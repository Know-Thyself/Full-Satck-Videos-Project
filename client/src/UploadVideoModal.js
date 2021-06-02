import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import Modal from 'react-bootstrap/Modal';
import AddToQueueRoundedIcon from '@material-ui/icons/AddToQueueRounded';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';

const UploadVideoModal = ({ addNewVideo }) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [titleErrorAlert, setTitleErrorAlert] = useState(false);
  const [urlErrorAlert, setUrlErrorAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  const handleClose = () => {
    setShow(false);
    setTitle('');
    setUrl('');
  };
  const handleShow = () => setShow(true);

  const submitNewVideo = (e) => {
    e.preventDefault();
    const regExp =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const match = url.match(regExp);
    if (title === '' && show) {
      setTitleErrorAlert(true)
    } else if ((url === '' || !match) && show) {
      setUrlErrorAlert(true)
    } else if (title !== '' && match && show) {
      addNewVideo(title, url);
      setSuccessAlert(true);
      const alertTimer = () => {
        setSuccessAlert(false)
      }
      setTimeout(alertTimer, 4000);
    }
    const requestBody = { title: title, url: url }
    fetch('/api', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => console.log(data));
    if (title !== '' && url !== '') {
      setTitle('');
      setUrl('');
      setShow(false)
    }
  };

  return (
    <>
      <div className={successAlert ? 'success-alert' : 'd-none'}>
        <Alert className='alert-success' onClose={() => setSuccessAlert(false)}>Success! — Your videos is successfully uploaded!</Alert>
      </div>
      <Button className='add-button' variant='contained' color='primary' onClick={handleShow}>
        Add Video &nbsp;
        <AddToQueueRoundedIcon />
      </Button>
      <Modal
        className='modal'
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Video Uploader Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-fullscreen-lg-down'>
          Please enter a title and a valid url of a video
          <Alert className={titleErrorAlert ? 'alert-failure' : 'd-none'} severity='error' onClose={() => setTitleErrorAlert(false)}>Failure! — Title field should not be empty!</Alert>
          <TextField
            className='modal-content modal-text'
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            onChange={(e) => {
              setTitleErrorAlert(false);
              setTitle(e.target.value);
            }}
            value={title}
          />
          <Alert className={urlErrorAlert ? 'alert' : 'd-none'} severity='error' onClose={() => setUrlErrorAlert(false)}>Failure! — You have not entered a valid URL!</Alert>
          <TextField
            className='modal-content modal-text'
            margin="dense"
            id="url"
            label="URL"
            type="url"
            fullWidth
            onChange={(e) => {
              setUrlErrorAlert(false);
              setUrl(e.target.value);
            }}
            value={url}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className='upload-and-cancel-buttons'>
            <Button type='cancel' className='cancel-button'
              variant='contained' color='default' onClick={handleClose}>Cancel</Button>
            <Button onClick={submitNewVideo} type='submit' className='submit-btn'
              variant='contained' color='primary'>
              Upload
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UploadVideoModal;