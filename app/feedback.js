const express = require('express');
const router = express.Router();
const Feedback = require('./models/feedback.js');
const Parking = require('./models/parking.js');


// Function to update the average score of a parking
async function updateAverageScore(parkingId) {
    const feedbacks = await Feedback.find({parking_id: parkingId}).sort({date: -1}).limit(30);
    const scores = feedbacks.map( f => f.score);
    const averageScore = scores.reduce((acc, score) => acc + score, 0) / scores.length || 0 ;

    await Parking.findByIdAndUpdate(parkingId, {averageScore});
}


router.post('/', async (req, res) => {
    const { user_id, parking_id, score, comment } = req.body;
    
    if (!user_id || !parking_id || !score) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (score < 1 || score > 5) {
        return res.status(400).json({ message: 'Invalid score' });
    }

    try{
        const newFeedback = new Feedback({ 
            user_id, parking_id, score, comment,
            date: new Date() 
        });
        await newFeedback.save();
        await updateAverageScore(parking_id);
        res.status(201).json({ message: 'Feedback created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, parking_id, score, comment } = req.body;

    if (!user_id && !parking_id && score === undefined && !comment) {
        return res.status(400).json({ message: 'No fields provided to update' });
    }

    if (score && (score < 1 || score > 5)) {
        return res.status(400).json({ message: 'Invalid score' });
    }

    try{

        const existingFeedback = await Feedback.findById(id);
        if (!existingFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }


        const updatedFeedback = await Feedback.findByIdAndUpdate(
            id,
            { user_id, parking_id, score, comment },
            { new: true, runValidators: true }
        );

        if (!updatedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        if (existingFeedback.parking_id !== parking_id) {
            await updateAverageScore(existingFeedback.parking_id);
        }

        await updateAverageScore(parking_id);

        res.json({ message: 'Feedback updated successfully', feedback: updatedFeedback });
    } catch (error){
        res.status(500).json({ message: 'Internal server error' });
    }

});

router.get('/:id', async (req, res) => {
    try{
        const foundFeedback = await Feedback.findById(req.params.id);
        if (foundFeedback) {
            return res.json(foundFeedback);
        } else {
            res.status(404).json({message: 'Feedback not found'})
        }
    } catch (error) {
        res.status(500). json({ error: 'Internal server error'})
    }
});


router.get('/', async (req, res) => {
    try {
        res.json(await Feedback.find()); 
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
        if (deletedFeedback) {
            await updateAverageScore(deletedFeedback.parking_id);
            res.json({ message: 'Feedback deleted successfully' });
        } else {
            res.status(404).json({ message: 'Feedback not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;