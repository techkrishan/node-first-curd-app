const Contact = require('../models/contact.model.js');

// Create and Save a new contact
exports.create = (req, res) => {
    // Validate request
    if (!req.body.first_name) {
        return res.status(400).send({
            message: "Contact first name can not be empty"
        });
    }

    // Create a contact
    const contact = new Contact({
        first_name: req.body.first_name || "First name is required",
        last_name: req.body.last_name || "Last name is required",
        email: req.body.email || "Email is required",
        mobile: req.body.mobile || "Mobile is required",
    });

    // Save contact in the database
    contact.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the contact."
            });
        });
};

// Retrieve and return all contacts from the database.
exports.findAll = (req, res) => {
    const { page, per_page, sort_by, ord, search_keyword } = req.query;
    const sortByObj = {};
    sortByObj[sort_by || 'updatedAt'] = ((ord == "-1" || ord == "1") ? parseInt(ord) : 1);
    const searchString = search_keyword || '';
    const searchObj = searchString ? {$text: {$search: searchString}} : {};
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(per_page, 10) || 10,
        sort: sortByObj
    };

    Contact.paginate(searchObj, options)
        .then(contacts => {
            res.send(contacts);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving contacts."
            });
        });
};

// Find a single contact with a contactId
exports.findOne = (req, res) => {
    Contact.findById(req.params.contactId)
        .then(contact => {
            if (!contact) {
                return res.status(404).send({
                    message: "Contact not found with id " + req.params.contactId
                });
            }
            res.send(contact);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Contact not found with id " + req.params.contactId
                });
            }
            return res.status(500).send({
                message: "Error retrieving contact with id " + req.params.contactId
            });
        });
};

// Update a contact identified by the contactId in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body.first_name) {
        return res.status(400).send({
            message: "Contact first name can not be empty"
        });
    }

    // Find contact and update it with the request body
    Contact.findByIdAndUpdate(req.params.contactId, {
        first_name: req.body.first_name || "First name is required",
        last_name: req.body.last_name || "Last name is required",
        email: req.body.email || "Email is required",
        mobile: req.body.mobile || "Mobile is required",
    }, { new: true, useFindAndModify: false })
        .then(contact => {
            if (!contact) {
                return res.status(404).send({
                    message: "Contact not found with id " + req.params.contactId
                });
            }
            res.send(contact);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Contact not found with id " + req.params.contactId
                });
            }
            return res.status(500).send({
                message: "Error updating contact with id " + req.params.contactId
            });
        });
};

// Delete a contact with the specified contactId in the request
exports.delete = (req, res) => {
    Contact.findByIdAndRemove(req.params.contactId, { useFindAndModify: false })
        .then(contact => {
            if (!contact) {
                return res.status(404).send({
                    message: "Contact not found with id " + req.params.contactId
                });
            }
            res.send({ message: "Contact deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Contact not found with id " + req.params.contactId
                });
            }
            return res.status(500).send({
                message: "Could not delete contact with id " + req.params.contactId
            });
        });
};