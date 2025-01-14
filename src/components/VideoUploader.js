// src/components/VideoUploader.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Grid2 as Grid } from '@mui/material';
import VideoFrame from './VideoFrame';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const VideoUploader = () => {
  const [expName, setExpName] = useState('');
  const [videos, setVideos] = useState([]);
  const [videoPaths, setVideoPaths] = useState([]);
  const [frames, setFrames] = useState([]);
  const [points, setPoints] = useState([]);
  const [promptTypes, setPromptTypes] = useState([]);
  const [types, setTypes] = useState([]);
  const [isDefect, setIsDefect] = useState([]);
  const [labels, setLabels] = useState([]);
  const [singleVideo, setSingleVideo] = useState(false);
  // const [nthFrame, setNthFrame] = useState(3);
  const [descs, setDescs] = useState([]);
  const [nthFrames, setNthFrames] = useState([]);
  const [defectTypes, setDefectTypes] = useState([]);

  const handleRefresh = () => {
    setFrames([]);
    setPoints([]);
    setPromptTypes([]);
    setVideos([]);
    setVideoPaths([]);
    setLabels([]);
    setExpName('');
    setSingleVideo(false);
    // setNthFrame(3);
    setDescs([]);
    setDefectTypes([]);
    setNthFrames([]);
  };

  const handleFileChange = (e) => {
    console.log('files', e.target.files)
    const files = Array.from(e.target.files)
    files.forEach(file => {
      if (!videoPaths.includes(file.name)) {
        setVideos(prev => [...prev, file]);
      }
      setVideoPaths(prev => [...prev, file.name]);

      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadeddata = () => {
        videoElement.currentTime = 0;
        videoElement.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

          setFrames(prevFrames => [...prevFrames, [{
            src: canvas.toDataURL(),
            name: file.name,
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
          }]])
          setPromptTypes(prev => ([ ...prev, [1]])); // Default to positive prompt
          // set.push();
        };
      };
    });
  };

  const handleExpNameChange = (e) => {
    setExpName(e.target.value);
  };


  const handleImageClick = (index, point, gt = false) => {
    // debugger
    setPoints(prevPoints => {
      const newPoints = [...prevPoints];
      newPoints[index] = gt ?
        [newPoints[index]?.[0], [...(newPoints[index]?.[1] || []), { ...point, type: promptTypes[index]?.[1] === 0 ? 0 : 1 }]] :
        [
          [...(newPoints[index]?.[0] || []), { ...point, type: promptTypes[index]?.[0] }],
          ...(newPoints[index]?.length > 1 ? [newPoints[index]?.[1] === 0 ? 0 : 1] : [])
        ];
      // newPoints[index] = [...(newPoints[index] || []), { ...point, type: promptTypes[index] }];
      return newPoints;
    })
  };

  const handlePromptChange = (index, newType, gt = false) => {
    setPromptTypes(prev => {
      const newPromptTypes = [...prev];
      newPromptTypes[index] = gt ? 
        [newPromptTypes[index]?.[0], newType] : 
        [
          newType, 
          ...(newPromptTypes[index].length > 1 ? [newPromptTypes[index][1]] : [])
        ];
      return newPromptTypes;
    });
  };

  const handleIsDefectChange = (index, newIsDefect) => {
    setIsDefect(prev => {
      const newIsDefects = [...prev];
      newIsDefects[index] = newIsDefect;
      return newIsDefects;
    });
    if (newIsDefect) {
      setFrames(prev => {
        const newFrames = [...prev];

        newFrames[index] = [
          newFrames[index][0],
          {
            ...newFrames[index][0]
          }
        ];
        return newFrames;
      });
    } else {
      // remove the ground truth frame
      setFrames(prev => {
        const newFrames = [...prev];
        newFrames[index] = [newFrames[index]?.[0]];
        return newFrames;
      });

      // remove the ground truth prompt types
      setPromptTypes(prev => {
        const newPromptTypes = [...prev];
        newPromptTypes[index] = [newPromptTypes[index]?.[0] || 1];
        return newPromptTypes;
      });
    }
  };

  const handleTypeChange = (index, newType) => {
    setTypes(prev => {
      const newTypes = [...prev];
      newTypes[index] = newType;
      return newTypes;
    });
    if (newType === 'train') {
      setLabels(prev => {
        const newLabels = [...prev];
        newLabels[index] = 'good';
        return newLabels;
      });

      // set isDefect to false
      setIsDefect(prev => {
        const newIsDefects = [...prev];
        newIsDefects[index] = false;
        return newIsDefects;
      });
    } else {
      setLabels(prev => {
        const newLabels = [...prev];
        newLabels[index] = '';
        return newLabels;
      });
    }
  };

  const handleLabelChange = (index, newLabel) => {
    setLabels(prev => {
      const newLabels = [...prev];
      newLabels[index] = newLabel;
      return newLabels;
    });
  };

  const handleDescChange = (index, newDesc) => {
    setDescs(prev => {
      const newDescs = [...prev];
      newDescs[index] = newDesc;
      return newDescs;
    });
  };

  const handleNthFrameChange = (index, newNthFrame) => {
    setNthFrames(prev => {
      const newNthFrames = [...prev];
      newNthFrames[index] = newNthFrame;
      return newNthFrames;
    });
  };

  const handleSubmit = async () => {
    const PORT=5000;
    // debugger
    const formData = new FormData();

    try {
      let videoPrompts = videos.map((file, index) => ([
        points[index][0]?.map(
          point => ({x: point.x, y: point.y, type: point.type})
        ) || [],
        points[index][1]?.map(
          point => ({x: point.x, y: point.y, type: point.type})
        ) || []
      ]));

      // first make call to get the list of videos already present in the backend
      const response = await axios.get(`http://localhost:${PORT}/videos`);
      const videoList = response.data.videos;

      console.log('Video list on server:', videoList);
      videos.forEach((file) => {
        if (!videoList.includes(file.name)) {
          formData.append('videos', file);
        }
      });

      const videoFileNames = frames.map(frame => frame[0].name);
      console.log('Video file names:', videoFileNames);

      let updatedIsDefectList = [...isDefect];
      // fill false values in isDefect if missing
      labels.forEach((_, index) => {
        if (updatedIsDefectList[index] === undefined) {
          updatedIsDefectList[index] = false;
        }
      });

      // Append prompts
      formData.append('prompts', JSON.stringify(videoPrompts));
      formData.append('videoPaths', JSON.stringify(videoFileNames));
      formData.append('labels', JSON.stringify(labels));
      formData.append('types', JSON.stringify(types));
      formData.append('isDefect', JSON.stringify(updatedIsDefectList));
      formData.append('expName', expName);
      formData.append('singleVideo', singleVideo);
      formData.append('nthFrames', JSON.stringify(nthFrames));
      response = await axios.post(`http://localhost:${PORT}/process`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        }
      });
      if (response.status === 200) {
        console.log('Videos and prompts sent to backend successfully!');
      } else {
        console.log(response.data);
        alert('Videos and prompts failed to send to backend!');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = (index) => {
    setFrames(prev => {
      const newFrames = [...prev];
      newFrames.splice(index, 1);
      return newFrames;
    });
    setPoints(prev => {
      const newPoints = [...prev];
      newPoints.splice(index, 1);
      return newPoints;
    });
    setPromptTypes(prev => {
      const newPromptTypes = [...prev];
      newPromptTypes.splice(index, 1);
      return newPromptTypes;
    });
    setLabels(prev => {
      const newLabels = [...prev];
      newLabels.splice(index, 1);
      return newLabels;
    });
    setDescs(prev => {
      const newDescs = [...prev];
      newDescs.splice(index, 1);
      return newDescs;
    });
    setNthFrames(prev => {
      const newNthFrames = [...prev];
      newNthFrames.splice(index, 1);
      return newNthFrames;
    });
  };

  const handlePointsDelete = (index, gt = false) => {
    setPoints(prev => {
      const newPoints = [...prev];
      newPoints[index] = gt ? [
        newPoints[index]?.[0] || []
      ] : [
        [],
        newPoints[index]?.[1] || []
      ]
      return newPoints;
    });
  }

  useEffect(() => {
    setNthFrames(prev => {
      labels.forEach((_, index) => {
        if (!prev[index]) {
          prev[index] = 3;
        }
      });
      return prev
    })
  }, [labels])

  return (
    <Container maxWidth="lg">
      <input
        type="text"
        value={expName}
        onChange={handleExpNameChange}
        placeholder="Enter experiment name"
        required
      />

      <input
        accept="video/*"
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="upload-video"
        required
        multiple
      />
      <label htmlFor="upload-video">
        <Button style={{margin: 4}} variant="contained" color="primary" component="span">
          Upload Videos
        </Button>
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={singleVideo}
          onChange={(e) => setSingleVideo(e.target.checked)}
        />
        Single Video
      </label>
      <Grid container spacing={2} style={{ marginTop: '16px' }}>
        {frames.map((frame, index) => (
          <>
            <Grid item xs={12} key={index}>
              <VideoFrame
                frame={frame}
                index={index}
                type={types[index]}
                onTypeChange={handleTypeChange}
                isDefect={isDefect[index]}
                onIsDefectChange={handleIsDefectChange}
                onImageClick={handleImageClick}
                promptType={promptTypes[index]}
                onPromptChange={handlePromptChange}
                points={points}
                label={labels[index] || ''}
                // desc={descs[index] || ''}
                nthFrame={nthFrames[index]}
                onLabelChange={handleLabelChange}
                onDescChange={handleDescChange}
                onDelete={() => handleDelete(index)}
                onNthFrameChange={handleNthFrameChange}
                defectTypes={defectTypes?.length ? defectTypes : ['good']}
                onPointsDelete={handlePointsDelete}
              />
            </Grid>
          </>

        ))}
      </Grid>
      
      <br />
      <input
        accept="video/*"
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="upload-video2"
        required
        multiple
      />
      <label htmlFor="upload-video2">
        <Button style={{margin: 4}} variant="contained" color="primary" component="span">
          Upload Videos
        </Button>
      </label>
      <br />
      {/* add a refresh button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleRefresh}
        style={{ marginTop: '16px' }}
      >
        Refresh
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSubmit}
        style={{ marginTop: '16px' }}
      >
        Submit Data
      </Button>
    </Container>
  );
};

export default VideoUploader;
