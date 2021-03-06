const customError = require('../utils/CustomErrors');

module.exports = (token, protectedByOAuth) => {
  const jwt = require('jsonwebtoken');

  const privateKey = `-----BEGIN RSA PRIVATE KEY-----
  MIICXQIBAAKBgQCON0+CsIQ+GAjYH6jpWb/7mKCFUEV3kZOG1Xqm2o/rWaP+IBYk
  hzrDL17GNGCoNVd2V+DZNwvOH/z+HX+TGOdby7FcjF5WlbGOdSD+m+NBL2nSLtu6
  Rkd4tUevLEyQMFGw4WxIsgB5NWuJV3ZBanbR4QWbakuiZNGvZSLXiaV0RQIDAQAB
  AoGAEt7T9gtmALc/tS2+Q/hcuQ2vfwD/trXiVWnONIWbwybJ09Z+Gaq36V5HvRUG
  Hku1p0ZR14CuWFN2RmGzo9kSGbDWO0Bi/I0uGBpcSl4e3Vw2SrQ0YCky14Ha3RXJ
  taCzBflb157NSl1pRGlCyo5GG5UQ3OCitYoxbpKNwqSxKQECQQDe1EKAYUMqRFOU
  2oD4si+XlQUUoseHilfMFg1PCEelKihWtQwZyJJT6tq/YQ5R/VGEr32puOCNrr6U
  Qs1lLO9dAkEAo2L8phB6VTX3CR/2nnH3mKpw8b3iGGFCNxP9OSa+dqVVxzBCo9lt
  g21RBZ5j0J/VwfIz2JuGWO7ezL5xseaSCQJBAIWvxUIumFRIb/jTayNKDEGeN1Ed
  JCaOeoRICq4K4qkV9OOodV0Wt6u/MIQ3X5cTKxA3FWZ5M8ftOgvLVF1KK0UCQFh3
  2tGYjoThKZg5RHJax3RUpb9fz7LfxtjH7A8sGWlo8N9gFFVf/9pwMLTYJLfsM/RG
  Tyh0XfR9swot/KYVcPECQQC8O2ZH6dOO4C+EOzKW8iM3fpGI7rqMqh8i7RNhJ71g
  QbviswutnTI49DNbE/l4UVRT8OaONNSfcHwsbiwjUfvO
  -----END RSA PRIVATE KEY-----`; // this was generated online. do it properly.. and store in vault

  const decodedToken = jwt.verify(token, privateKey);

  // don't really think this is required to be honest
  if (protectedByOAuth && !decodedToken.customerId) throw customError('authToken has no customerId. something fishy going on', 400)
}