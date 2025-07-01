// InputForm.js
import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import './customStyles.css';
import { paperStyle } from './styles';

function InputForm({
  internalSymbol,
  setInternalSymbol,
  internalVarList1,
  setInternalVarList1,
  internalVarList2,
  setInternalVarList2,
  internalStartDate,
  setInternalStartDate,
  internalEndDate,
  setInternalEndDate,
  internalCustomRule,
  setInternalCustomRule,
  internalError,
  internalLoading,
  handleSubmit,
}) {
  const theme = useTheme();
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(14);
  const aceEditorRef = useRef(null);

  const toggleEditorMaximized = () => {
    setIsEditorMaximized((prev) => !prev);
  };

  const increaseFontSize = () => {
    const newFontSize = editorFontSize + 1;
    setEditorFontSize(newFontSize);
    if (aceEditorRef.current && aceEditorRef.current.editor) {
      aceEditorRef.current.editor.setFontSize(newFontSize);
    }
  };

  const decreaseFontSize = () => {
    const newFontSize = Math.max(10, editorFontSize - 1);
    setEditorFontSize(newFontSize);
    if (aceEditorRef.current && aceEditorRef.current.editor) {
      aceEditorRef.current.editor.setFontSize(newFontSize);
    }
  };

  const editorContainerStyle = isEditorMaximized
    ? {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1300,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
      }
    : {
        width: '100%',
        height: '400px',
        mt: 2,
        position: 'relative',
      };

  // Common IconButton style for consistency
  const iconButtonStyle = {
    backgroundColor: 'rgba(255,255,255,0.7)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.9)',
    },
    borderRadius: '50%',
    ml: 1,
  };

  return (
    <Card variant="outlined" sx={paperStyle}>
      <CardContent>
        {internalError && (
          <Typography color="error" gutterBottom>
            {internalError}
          </Typography>
        )}
        <Grid container spacing={2}>
          {/* Symbol Field */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Symbol"
              value={internalSymbol}
              onChange={(e) => setInternalSymbol(e.target.value)}
              fullWidth
            />
          </Grid>
          {/* Var List 1 Field */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Var List 1 (comma-separated)"
              value={internalVarList1}
              onChange={(e) => setInternalVarList1(e.target.value)}
              fullWidth
            />
          </Grid>
          {/* Var List 2 Field */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Var List 2 (comma-separated)"
              value={internalVarList2}
              onChange={(e) => setInternalVarList2(e.target.value)}
              fullWidth
            />
          </Grid>
          {/* Start Date Picker */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={internalStartDate}
                onChange={(newValue) => setInternalStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          {/* End Date Picker */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={internalEndDate}
                onChange={(newValue) => setInternalEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          {/* Custom Rule Editor */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Custom Rule
            </Typography>
            <Box sx={editorContainerStyle}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  zIndex: 1400,
                }}
              >
                <IconButton onClick={decreaseFontSize} sx={iconButtonStyle}>
                  <ZoomOutIcon sx={{ color: 'black' }} />
                </IconButton>
                <IconButton onClick={increaseFontSize} sx={iconButtonStyle}>
                  <ZoomInIcon sx={{ color: 'black' }} />
                </IconButton>
                <IconButton onClick={toggleEditorMaximized} sx={iconButtonStyle}>
                  {isEditorMaximized ? (
                    <FullscreenExitIcon sx={{ color: 'black' }} />
                  ) : (
                    <FullscreenIcon sx={{ color: 'black' }} />
                  )}
                </IconButton>
              </Box>
              <AceEditor
                ref={aceEditorRef}
                mode="python"
                theme="monokai"
                value={internalCustomRule}
                onChange={(value) => setInternalCustomRule(value)}
                name="customRuleEditor"
                editorProps={{ $blockScrolling: true }}
                fontSize={editorFontSize}
                width="100%"
                height="100%"
                className="ace-editor"
              />
            </Box>
          </Grid>
          {/* Submit Button and Loading Indicator */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
              {internalLoading && (
                <CircularProgress
                  size={24}
                  sx={{ ml: 2, verticalAlign: 'middle' }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default InputForm;
