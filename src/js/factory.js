'use strict';

app.factory('postFactory', function ($q, $http, authFactory) {

    const domain = 'http://localhost:3000'

    const getAllPosts = (id) => {
        return $q((resolve, reject) => {
            $http.get(domain + '/posts/')
                .then(posts => resolve(posts.data))
                .catch(error => reject(error));
        });
    };

    const getPost = (id) => {
        return $q((resolve, reject) => {
            $http.get(domain + '/posts/' + id)
                .then(post => resolve(post.data))
                .catch(error => reject(error));
        });
    };

    const addPost = (model) => {
        return $q((resolve, reject) => {
            $http({
                    method: 'POST',
                    url: domain + '/posts/',
                    data: model
                })
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    };

    const editPost = (id, model) => {
        return $q((resolve, reject) => {
            $http({
                    method: 'PUT',
                    url: domain + '/posts/' + id,
                    data: model
                })
                .then(post => resolve(post.data.id))
                .catch(error => reject(error));
        });
    };

    const deletePost = id => {
        return $q((resolve, reject) => {
            $http({
                    method: 'DELETE',
                    url: domain + '/posts/' + id
                })
                .then(() => resolve())
                .catch(error => reject(error));
        });
    };

    return {
        getAllPosts,
        getPost,
        addPost,
        editPost,
        deletePost
    };
});

app.factory('authFactory', function () {
    return {
        isAuth: id => {
            // TODO : [ ... ]
        }
    };
});

app.service('errorService', function () {
    return {
        /**
        * Extracts messages from any errors to include in error message template
        * @param {object} error
        * @returns {string} error message
        */
        getErrorTemplate: error => {
            return `Well shoot, we had this happening:
                    ${ error.message }`;
        }
    };
});