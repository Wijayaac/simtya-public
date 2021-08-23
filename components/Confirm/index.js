import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const Confirm = (props) => {
  const { buttonLabel, className, size, disabled } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button
        color="info"
        disabled={disabled}
        className={className}
        onClick={toggle}>
        {buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={toggle} size={size}>
        <ModalHeader toggle={toggle}>{buttonLabel} Vehicles</ModalHeader>
        <ModalBody>{props.children}</ModalBody>
      </Modal>
    </div>
  );
};

export default Confirm;
