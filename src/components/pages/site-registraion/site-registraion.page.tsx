import { useEffect, useState } from "react";
import { Button, Form, Table, Modal, InputGroup } from "react-bootstrap";
import axios, { AxiosResponse } from "axios";
import { columns } from "./constant";
import "../page.css";
import { URL as url } from "../../constant/constant";

export const LocationPage = () => {
  const [show, setShow] = useState(false);
  const [editModel, setEditModal] = useState(false);
  const [deleteModel, setDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState<any>("");
  const [formData, setFormData] = useState<any>({
    siteId: "",
    siteName: "",
    siteDescription: "",
  });
  const [deleteID, setDeleteID] = useState<any>({});

  const handleClose = () => {
    setShow(false);
    setEditModal(false);
    setDeleteModal(false);
  };

  const viewAll = `${url}/5g/site/viewAllSites`;
  const createURL = `${url}/5g/site/registerSite`;
  const searchURL = `${url}/5g/site/`;
  const deleteURL = `${url}/5g/site/deleteSite`;
  const updateURL = `${url}/5g/site/`;

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    getAllRecord();
  }, []);

  function getAllRecord() {
    axios.get(viewAll).then((value: AxiosResponse<any, any>): void => {
      const data = value.data;
      if (data.status === "OK") {
        const allData = data.response.reverse();
        setRowData(allData);
      } else {
        console.log("View all api is not working.");
      }
    });
  }

  const createRec = () => {
    const data = formData;
    axios.post(createURL, data).then((res) => {
      if (res.status) {
        getAllRecord();
        setShow(false);
      }
    });
  };

  const editRec = () => {
    const data = {
      siteId: formData.siteId,
      siteName: formData.siteName,
      siteDescription: formData.siteDescription,
    };
    axios.post(updateURL, data).then((res) => {
      setEditModal(false);
      getAllRecord();
    });
  };

  const deleteRec = () => {
    const config = {
      data: {
        siteId: deleteID.siteId,
      },
    };
    axios.delete(deleteURL, config).then((res) => {
      setDeleteModal(false);
      getAllRecord();
    });
  };

  const openCreateModal = () => {
    setFormData({
      siteId: "",
      siteName: "",
      siteDescription: "",
    });
    setShow(true);
  };

  const openEditModal = (item: any) => {
    setFormData({
      siteId: item.siteId,
      siteName: item.siteName,
      siteDescription: item.siteDescription,
    });
    setEditModal(true);
  };

  const openDeleteModal = (item: any) => {
    setDeleteID(item);
    setDeleteModal(true);
  };

  const onValueChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const searchRec = () => {
    const searchParam = {
      params: {
        siteName: searchText.value,
      },
    };
    if (searchText.value !== "") {
      axios
        .get(searchURL, searchParam)
        .then((value: AxiosResponse<any, any>): void => {
          const data = value.data;
          if (value.status === 200) {
            const searchData = data.response;
            setRowData(searchData);
          } else {
            console.log("No search found");
          }
        });
    } else {
      getAllRecord();
    }
  };

  return (
    <div className="container">
      <div className="search-field">
        <InputGroup className="mb-3" onChange={(e) => setSearchText(e.target)}>
          <Form.Control
            placeholder="Search Site"
            aria-label="Search Site"
            aria-describedby="search-btn-1"
          />
          <Button
            variant="outline-secondary"
            id="search-button"
            onClick={searchRec}
          >
            Search
          </Button>
        </InputGroup>
      </div>
      <div className="create-button">
        <Button variant="info" onClick={() => openCreateModal()}>
          Create Site
        </Button>
      </div>
      <div className="table">
        <Table striped bordered hover>
          <thead>
            <tr>
              {columns.map((item: any, index: number) => {
                return <th key={index}>{item.name}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {rowData.map((item: any, index: number) => {
              return (
                <tr key={index}>
                  {/* <td>{item['nfId']}</td> */}
                  <td>{item["siteName"]}</td>
                  <td>{item["siteDescription"]}</td>
                  <td>
                    <Button variant="link" onClick={() => openEditModal(item)}>
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => openDeleteModal(item)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Site Name</Form.Label>
              <Form.Control
                name="siteName"
                type="text"
                placeholder="Enter Site Name"
                onChange={(e) => onValueChange(e)}
                value={formData.siteName}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Site Description</Form.Label>
              <Form.Control
                name="siteDescription"
                type="text"
                placeholder="Enter City Description"
                onChange={(e) => onValueChange(e)}
                value={formData.siteDescription}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={createRec}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={editModel} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>City</Form.Label>
              <Form.Control
                name="siteName"
                type="text"
                placeholder="Enter City"
                onChange={(e) => onValueChange(e)}
                value={formData.siteName}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Site Description</Form.Label>
              <Form.Control
                name="siteDescription"
                type="text"
                placeholder="Enter City Description"
                onChange={(e) => onValueChange(e)}
                value={formData.siteDescription}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editRec}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={deleteModel} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete all{" "}
            <strong>{deleteID.nfType}</strong> (NF Type) Rec?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={deleteRec}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
