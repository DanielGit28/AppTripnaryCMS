import { useState, useEffect } from 'react';
import { Form, FormControl, Dropdown } from 'react-bootstrap';

const DropdownSearch = ({ options, onSelect, register, errors, selectedCiudadOption  }) => {
  const [selectedOption, setSelectedOption] = useState(selectedCiudadOption);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setSelectedOption(selectedCiudadOption);
  }, [selectedCiudadOption]);

  const handleSelect = (eventKey, event) => {
    const selected = options.find((option) => option.value === eventKey);
    setSelectedOption(selected);
    onSelect(selected);
  };


  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filterOptions = (options, searchValue) => {
    return options.filter((option) =>
      normalizeString(option.label).includes(normalizeString(searchValue))
    );
  };

  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const filteredOptions = filterOptions(options, searchValue);


  return (
    <Form.Group className="mb-3" controlId="idCiudad">
      <Form.Label>Ciudad</Form.Label>
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle
          variant="primary"
          id="dropdown-search"
          className="w-100"
          toggleIcon={null}
          style={{ backgroundColor: 'transparent', borderColor: '#c4cdd5', color: '#1B2127' }}
        >
          {selectedOption ? selectedOption.label : 'Seleccionar opción'}
        </Dropdown.Toggle>
        <Dropdown.Menu className="w-100">
          <FormControl
            type="text"
            placeholder="Buscar..."
            onChange={handleInputChange}
          />
          <Dropdown.Divider />
          {filteredOptions.map((option) => (
            <Dropdown.Item key={option.value} eventKey={option.value}>
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {errors.idCiudad && (
        <Form.Control.Feedback type="invalid">
          Este campo es requerido.
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default DropdownSearch;
