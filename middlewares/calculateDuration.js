const calculateDuration = (req, res, next) => {
  const { startTime, endTime } = req.body;

  if (startTime && endTime) {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;
    req.body.duration = end >= start ? end - start : 1440 - start + end;
  }

  next();
};

export default calculateDuration;
