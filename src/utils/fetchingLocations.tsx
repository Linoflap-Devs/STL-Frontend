
const AssignedLocationForm = ({ regions, provinces, cities, selectState, setSelectState, errors }) => {
    // Handle dropdown selection changes
    const handleSelectChange = (event: SelectChangeEvent, key: string) => {
      const { value } = event.target;
      setSelectState((prevState) => ({
        ...prevState,
        [key]: value,
        ...(key === "region" && { province: "", city: "" }), // Reset dependent fields
        ...(key === "province" && { city: "" }),
      }));
    };
  
    return (
      <Grid item xs={6}>
        <Typography variant="h6" sx={{ marginBottom: "0.9rem" }}>
          Assigned Location
        </Typography>
        {["region", "province", "city", "barangay", "streetaddress"].map((key) => (
          <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
            {["region", "province", "city"].includes(key) ? (
              <FormControl fullWidth error={!!errors[key]}>
                <InputLabel id={`${key}-label`}>{formatKey(key)}</InputLabel>
                <Select
                  labelId={`${key}-label`}
                  value={selectState[key] || ""}
                  label={formatKey(key)}
                  disabled={
                    (key === "province" && !selectState.region) ||
                    (key === "city" && !selectState.province)
                  }
                  onChange={(e) => handleSelectChange(e, key)}
                  name={key}
                  inputProps={{ "aria-label": formatKey(key) }}
                >
                  {/* Populate Regions */}
                  {key === "region" &&
                    regions.map((region) => (
                      <MenuItem key={region.id} value={region.name}>
                        {region.name}
                      </MenuItem>
                    ))}
  
                  {/* Populate Provinces */}
                  {key === "province" &&
                    provinces
                      .filter((prov) => prov.region === selectState.region) // Filter based on selected region
                      .map((province) => (
                        <MenuItem key={province.id} value={province.name}>
                          {province.name}
                        </MenuItem>
                      ))}
  
                  {/* Populate Cities */}
                  {key === "city" &&
                    cities
                      .filter((city) => city.province === selectState.province) // Filter based on selected province
                      .map((city) => (
                        <MenuItem key={city.name} value={city.name}>
                          {city.name}
                        </MenuItem>
                      ))}
                </Select>
                {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
              </FormControl>
            ) : (
              <FormControl fullWidth error={!!errors[key]}>
                <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                <OutlinedInput
                  id={key}
                  name={key}
                  placeholder={`Enter ${formatKey(key)}`}
                  value={selectState[key]}
                  onChange={(e) => setSelectState({ ...selectState, [key]: e.target.value })}
                  label={formatKey(key)}
                />
                {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
              </FormControl>
            )}
          </Grid>
        ))}
      </Grid>
    );
  };
  