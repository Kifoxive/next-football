import { Controller } from 'react-hook-form';
import {
    BaseSelectProps,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { BaseFieldProps } from '../../types';

type MultiSelectFieldProps = BaseFieldProps &
    BaseSelectProps & {
        options: { label: string; value: string | number }[];
    };

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({ name, label, options, ...props }) => {
    return (
        <Controller
            name={name}
            render={({ field: { value, onChange }, fieldState: { error } }) => {
                return (
                    <FormControl fullWidth={props.fullWidth} error={Boolean(error?.message)}>
                        <InputLabel id={name + '-label'}>{label}</InputLabel>
                        <Select
                            // {...props}
                            labelId={name + '-label'}
                            id={name}
                            value={Array.isArray(value) ? value : []}
                            label={label}
                            onChange={(event) => {
                                onChange(event.target.value);
                            }}
                            error={Boolean(error?.message)}
                            multiple
                            renderValue={(selected: string[]) => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        marginY: '-5px',
                                    }}
                                >
                                    {selected.map((itemValue) => (
                                        <Chip
                                            key={itemValue}
                                            label={options.find(({ value }) => value === itemValue)?.label || ''}
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {options.map(({ label, value }) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                        {Boolean(error?.message) && <FormHelperText color="danger">{error?.message}</FormHelperText>}
                    </FormControl>
                );
            }}
        />
    );
};
