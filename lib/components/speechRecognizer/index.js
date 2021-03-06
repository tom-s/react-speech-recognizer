'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.speechRecognitionAvailable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var speechRecognitionAvailable = exports.speechRecognitionAvailable = function speechRecognitionAvailable() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window || 'mozSpeechRecognition' in window || 'msSpeechRecognition' in window;
};

var createSpeechRecognition = function createSpeechRecognition(lang, interimResults) {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = interimResults;
  return recognition;
};

var attachEvents = function attachEvents(recognition, _ref) {
  var _ref$onEnd = _ref.onEnd,
      onEnd = _ref$onEnd === undefined ? function () {} : _ref$onEnd,
      _ref$onError = _ref.onError,
      onError = _ref$onError === undefined ? function () {} : _ref$onError,
      _ref$onStart = _ref.onStart,
      onStart = _ref$onStart === undefined ? function () {} : _ref$onStart,
      _ref$onResult = _ref.onResult,
      onResult = _ref$onResult === undefined ? function () {} : _ref$onResult;

  recognition.onstart = onStart;
  recognition.onend = onEnd;
  recognition.onerror = onError;
  recognition.onend = onEnd;
  recognition.onresult = onResult;
  return recognition;
};

var SpeechRecognizer = function (_Component) {
  _inherits(SpeechRecognizer, _Component);

  function SpeechRecognizer() {
    _classCallCheck(this, SpeechRecognizer);

    return _possibleConstructorReturn(this, (SpeechRecognizer.__proto__ || Object.getPrototypeOf(SpeechRecognizer)).apply(this, arguments));
  }

  _createClass(SpeechRecognizer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.initRecognition(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!(0, _shallowequal2.default)(nextProps, this.props)) {
        this.initRecognition(nextProps);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.abortRecognition();
    }
  }, {
    key: 'abortRecognition',
    value: function abortRecognition() {
      if (this.recognition) {
        this.recognition = attachEvents(this.recognition, {}); // remove listeners before aborting
        this.recognition.abort();
      }
    }
  }, {
    key: 'initRecognition',
    value: function initRecognition(props) {
      var _this2 = this;

      var _props = this.props,
          _props$lang = _props.lang,
          lang = _props$lang === undefined ? 'en-GB' : _props$lang,
          onNotAvailable = _props.onNotAvailable,
          onTempResult = _props.onTempResult,
          _onResult = _props.onResult,
          _onStart = _props.onStart,
          _onError = _props.onError,
          _onEnd = _props.onEnd;

      // Check availability

      if (!speechRecognitionAvailable()) {
        return onNotAvailable && onNotAvailable();
      }

      // Abort previous instances of recognition already running
      this.abortRecognition();

      // Create new recognition
      var interimResult = !!onTempResult;
      var recognition = attachEvents(createSpeechRecognition(lang, interimResult), {
        onStart: function onStart(e) {
          _onStart && _onStart(e);
        },
        onEnd: function onEnd(e) {
          _onEnd && _onEnd(e);
          _this2.initRecognition(); // restart
        },
        onError: function onError(error) {
          _onError && _onError(error);
        },
        onResult: function onResult(e) {
          var transcript = e && e.results && e.results[0] && e.results[0][0] ? e.results[0][0] : null;
          var isFinal = e && e.results && e.results[0] ? e.results[0].isFinal : null;

          var cb = isFinal ? _onResult : onTempResult;
          cb && cb(transcript);
        }
      });

      // Start recognition
      recognition.start();

      // Store recognition so that it can be aborted
      this.recognition = recognition;
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return SpeechRecognizer;
}(_react.Component);

exports.default = SpeechRecognizer;