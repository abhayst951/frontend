import { useEffect, useState } from "react";
import { Button, Form, Table, Modal, InputGroup } from "react-bootstrap";
import axios, { AxiosResponse } from "axios";
import { columns, nfStatus } from "./constant";
import "../page.css";
import { URL as url } from "../../constant/constant";

export const FiveGSpectraPage = () => {
  const [show, setShow] = useState(false);
  const [editModel, setEditModal] = useState(false);
  const [deleteModel, setDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState<any>("");
  const [searchType, setSearchType] = useState<any>("");
  const [nfTypeListVal, setNFTypeListVal] = useState<any>([]);
  const [locationListValue, setLocationListValue] = useState<any>([]);
  const [formData, setFormData] = useState<any>({
    nfId: "",
    nfInstanceId: "",
    nfType: "",
    nfStatus: "",
    fqdn: "",
    ipAddress: "",
    location: "",
  });
  const [deleteID, setDeleteID] = useState<any>({});

  const handleClose = () => {
    setShow(false);
    setEditModal(false);
    setDeleteModal(false);
  };

  const viewAll = `${url}/5g/viewAllNetworkFunction`;
  const createURL = `${url}/5g/addNetworkFunction`;
  const searchURL = `${url}/5g/discoverNetworkFunction`;
  const deleteURL = `${url}/5g/deleteNetworkFunction`;
  const updateURL = `${url}/5g/updateNetworkFunction`;
  const nfSiteViewAll = `${url}/5g/networkFunction/viewAllNetworkFunction`;
  const locationViewAllSites = `${url}/5g/site/viewAllSites`;

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    getAllRecord();
    getNFSiteValueList();
    getLocationValueList();
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

  function getNFSiteValueList() {
    axios.get(nfSiteViewAll).then((value: AxiosResponse<any, any>): void => {
      const data = value.data;
      if (data.status === "OK") {
        const allData = data.response;
        setNFTypeListVal(allData);
      } else {
        console.log("View all api is not working.");
      }
    });
  }

  function getLocationValueList() {
    axios
      .get(locationViewAllSites)
      .then((value: AxiosResponse<any, any>): void => {
        const data = value.data;
        if (data.status === "OK") {
          const allData = data.response;
          setLocationListValue(allData);
        } else {
          console.log("View all api is not working.");
        }
      });
  }

  const createRec = () => {
    const data = formData;
    console.log("data", data);
    axios.post(createURL, data).then((res) => {
      if (res.status) {
        getAllRecord();
        setShow(false);
      }
    });
  };

  const editRec = () => {
    const data = {
      nfId: formData.nfId,
      nfInstanceId: formData.nfInstanceId,
      nfType: formData.nfType,
      nfStatus: formData.nfStatus,
      fqdn: formData.fqdn,
      ipAddress: formData.ipAddress,
      location: formData.location,
    };
    axios.put(updateURL, data).then((res) => {
      console.log("response: ", res);
      setEditModal(false);
      getAllRecord();
    });
  };

  const deleteRec = () => {
    const config = {
      data: {
        nfType: deleteID.nfType,
      },
    };
    axios.delete(deleteURL, config).then((res) => {
      setDeleteModal(false);
      getAllRecord();
    });
  };

  const openCreateModal = () => {
    setFormData({
      nfId: "",
      nfInstanceId: "",
      nfType: "",
      nfStatus: "",
      fqdn: "",
      ipAddress: "",
      location: "",
    });
    setShow(true);
  };

  const openEditModal = (item: any) => {
    setFormData({
      nfId: item.nfId,
      nfInstanceId: item.nfInstanceId,
      nfType: item.nfType,
      nfStatus: item.nfStatus,
      fqdn: item.fqdn,
      ipAddress: item.ipAddress,
      location: item.location,
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
        searchText: searchText.value,
        searchType: searchType,
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
        <InputGroup
          className="mb-3"
          onChange={(e) => {
            e.preventDefault();
            setSearchText(e.target);
          }}
        >
          <Form.Select
            aria-label="search NF"
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option>Select Column Type</option>
            <option value="nfType">NF Type</option>
            <option value="nfStatus">NF Status</option>
            <option value="ipAddress">IP Address</option>
            <option value="location">Location</option>
          </Form.Select>
          <Form.Control
            placeholder={`Search...`}
            aria-label="Search"
            aria-describedby="search-btn-1"
            className="search-btn"
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
          Create New NF
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
                  <td>{item["nfInstanceId"]}</td>
                  <td>{item["nfType"]}</td>
                  <td>{item["nfStatus"]}</td>
                  <td>{item["fqdn"]}</td>
                  <td>{item["ipAddress"]}</td>
                  <td>{item["location"]}</td>
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
          <Modal.Title>Create NF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>NF Instance ID</Form.Label>
              <Form.Control
                name="nfInstanceId"
                type="text"
                placeholder="Enter NF Instance ID"
                onChange={(e) => onValueChange(e)}
                value={formData.nfInstanceId}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>NF Type</Form.Label>
              <Form.Select
                name="nfType"
                onChange={(e) => onValueChange(e)}
                placeholder="Enter NF Type"
                value={formData.nfType}
              >
                <option value=""> Select NF Type </option>
                {nfTypeListVal.map((item: any) => (
                  <option value={item.nfName}> {item.nfName} </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>NF Status</Form.Label>
              <Form.Select
                name="nfStatus"
                onChange={(e) => onValueChange(e)}
                placeholder="Enter NF Status"
                value={formData.nfStatus}
              >
                <option value=""> Select NF Status </option>
                {nfStatus.map((item) => (
                  <option value={item.id}> {item.name} </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>FQDN</Form.Label>
              <Form.Control
                name="fqdn"
                type="text"
                placeholder="Enter FQDN"
                onChange={(e) => onValueChange(e)}
                value={formData.fqdn}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
              <Form.Label>IP Address</Form.Label>
              <Form.Control
                name="ipAddress"
                type="text"
                placeholder="Enter IP Address"
                onChange={(e) => onValueChange(e)}
                value={formData.ipAddress}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
              <Form.Label>Location</Form.Label>
              <Form.Select
                name="location"
                onChange={(e) => onValueChange(e)}
                placeholder="Enter Location"
                value={formData.location}
              >
                <option value="">Select Location</option>
                {locationListValue.map((item: any) => (
                  <option value={item.siteName}> {item.siteName} </option>
                ))}
              </Form.Select>
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
          <Modal.Title>Update NF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>NF Instance ID</Form.Label>
              <Form.Control
                name="nfInstanceId"
                type="text"
                placeholder="Enter NF Instance ID"
                onChange={(e) => onValueChange(e)}
                value={formData.nfInstanceId}
                autoFocus
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>NF Type</Form.Label>
              <Form.Select
                name="nfType"
                onChange={(e: any) => onValueChange(e)}
                placeholder="Enter NF Type"
                value={formData.nfType}
                disabled
              >
                {nfTypeListVal.map((item: any) => (
                  <option value={item.nfName}> {item.nfName} </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>NF Status</Form.Label>
              <Form.Select
                name="nfStatus"
                onChange={(e) => onValueChange(e)}
                placeholder="Enter NF Status"
                value={formData.nfStatus}
              >
                <option value=""> </option>
                {nfStatus.map((item: any) => (
                  <option value={item.id}> {item.name} </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>FQDN</Form.Label>
              <Form.Control
                name="fqdn"
                type="text"
                placeholder="Enter FQDN"
                onChange={(e) => onValueChange(e)}
                value={formData.fqdn}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
              <Form.Label>IP Address</Form.Label>
              <Form.Control
                name="ipAddress"
                type="text"
                placeholder="Enter IP Address"
                onChange={(e) => onValueChange(e)}
                value={formData.ipAddress}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
              <Form.Label>Location</Form.Label>
              <Form.Select
                name="location"
                onChange={(e) => onValueChange(e)}
                placeholder="Enter Location"
                value={formData.location}
              >
                <option value=""> </option>
                {locationListValue.map((item: any) => (
                  <option value={item.siteName}> {item.siteName} </option>
                ))}
              </Form.Select>
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
