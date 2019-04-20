var Comment = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var CommentPage = React.createClass({
  CommentedList: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleSubmit: function(comment) {
    var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.CommentedList();
  },
  render: function() {
    return (
      <div style={{ margin: '0 auto', width: '750px', fontSize: '20px' }}>
        <p>
          {"Yeah, but I never picked a fight in my entire life. I just wanna use the phone. I'm gonna ram him. I'm writing this down, this is good stuff. Stop it."}
        </p>
        <div style={{ display: 'block', borderBottom: '1px solid rgba(0,0,0,.12)', paddingBottom: '10px' }}>
        <a style={{ border: 'none', color: 'rgba(0,0,0,.68)', background: 'rgba(0,0,0,.05)', marginRight: '10' }} >Doc</a>
        <a style={{ border: 'none', color: 'rgba(0,0,0,.68)', background: 'rgba(0,0,0,.05)', marginRight: '10' }}>Marty McFly</a>
        <a style={{ border: 'none', color: 'rgba(0,0,0,.68)', background: 'rgba(0,0,0,.05)', marginRight: '10' }}>Time travel</a>
        </div>
        <p style={{ fontSize: '15px' }}>Responses</p>
        <Form onCommentSubmit={this.handleSubmit} />
        <ListComments data={this.state.data} />
      </div>
    );
  }
});

var Form = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },
  handleChange: function(e) {
    this.setState({text: e.target.value});
  },
  onKeyPress: function(e) {
    if(e.which === 13) {
      this.handleSubmit();
    }
  },
  handleSubmit: function(e) {
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onCommentSubmit({text: text});
    this.setState({ text: ''});
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Write a response..."
          value={this.state.text}
          onChange={this.handleChange}
          onKeyPress={this.onKeyPress}
          style={{ width: '750px', height: '70px', fontSize: '14'}}
        />
        <br/>
      </form>
    );
  }
});

var ListComments = React.createClass({
  render: function() {
    var comments = this.props.data.map(function(comment) {
      return (
        <div style={{ border: '1px solid rgba(0,0,0,.12)', marginTop: '20px',width: '750px',height: '70px' }}>
        <p style={{ color: 'green' }}>Marty McFly</p>
        <Comment key={comment.id}>
       {comment.text}
        </Comment>
        </div>
      );
    });
    return (
      <div style={{ fontSize: '14' }}>
        {comments}
      </div>
    );
  }
});

ReactDOM.render(
  <CommentPage url="/api/comments" />,
  document.getElementById('comment')
);
