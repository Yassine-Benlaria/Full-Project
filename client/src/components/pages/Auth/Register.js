import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Container, Form } from 'react-bootstrap';
import useStyles from './login-jss';

// Actions
import { register, clearErrors } from '../../../redux/actions/authActions';
import { setAlert } from '../../../redux/actions/alertActions';

// App layout components
import Spinner from '../../layout/Spinner/Spinner';

// Utils
import { WEBSITE_NAME } from '../../../utils/Data';

const Register = (props) => {
  const {
    isAuthenticated,
    error,
    loading,
    register,
    clearErrors,
    setAlert,
  } = props;

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const { username, email, password, password2 } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/');
    }

    // eslint-disable-next-line
  }, [isAuthenticated, props.history]);

  useEffect(() => {
    if (error && error.length) {
      if (typeof error === 'object') {
        error.forEach((err) => {
          setAlert(err.msg, 'danger');
        });
      } else {
        setAlert(error, 'danger');
      }

      clearErrors();
    }

    // eslint-disable-next-line
  }, [error]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (username === '' || email === '' || password === '') {
      setAlert('Please enter all fields', 'danger');
    } else if (password.length < 6) {
      setAlert('Password must contain at least 6 characters', 'danger');
    } else if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      await register({ username, email, password });
    }
  };

  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>{`${WEBSITE_NAME} | Register`}</title>
      </Helmet>
      <Container className={`${classes.root} `}>
        <div className='container-inner px-3 mt-4'>
          <div className='auth mx-auto'>
            <h4 className='mb-3 text-center '>
              <strong className='title' >Create your account</strong>
            </h4>
            <Form className='form form-container' onSubmit={onSubmit}>
              <Form.Group>
              <Form.Label className='subtitle'> Email </Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Email'
                  name='email'
                  value={email}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group>
              <Form.Label className='subtitle'> Username </Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Username'
                  name='username'
                  value={username}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group>
              <Form.Label className='subtitle'> Password </Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Password'
                  name='password'
                  value={password}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group>
              <Form.Label className='subtitle'> Password confirmation </Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Password confirmation'
                  name='password2'
                  value={password2}
                  onChange={onChange}
                />
              </Form.Group>

              <div className='links d-flex align-items-center justify-content-between mt-4'>
                <span>
                  Have an account?{' '}
                  <Link className='link-secondary' to='/login'>
                    Sign in
                  </Link>
                </span>

                {loading ? (
                  <Spinner />
                ) : (
                  <button className='button-primary' type='submit' onClick={onSubmit}>
                    Create
                  </button>
                )}
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </>
  );
};

const mapSateToProps = (state) => ({
  error: state.auth.error,
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapSateToProps, { register, clearErrors, setAlert })(
  Register
);
