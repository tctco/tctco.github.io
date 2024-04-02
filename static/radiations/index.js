let all_questions = []

class Choice {
  constructor(content, correctness) {
    this.content = content
    this.correctness = correctness
  }
}

let touchstartX = 0
let touchendX = 0


class Question {
  constructor(text, type, choices, category, status) {
    this.question_string = text
    this.type = type
    this.choices = choices
    this.status = status
    this.selected_answers = [],
      this.category = category
  }

  render(container) {
    // For when we're out of scope
    var self = this;

    // Fill out the question label
    var question_string_h2;
    if (container.children('h2').length === 0) {
      question_string_h2 = $('<h2>').appendTo(container);
    } else {
      question_string_h2 = container.children('h2').first();
    }
    question_string_h2.text(this.question_string);
    $('#tag').text(this.type === 'single' ? '单选' : '多选')

    // Clear any radio buttons and create new ones
    if (container.children('input[type=checkbox]').length > 0) {
      container.children('input[type=checkbox]').each(function () {
        var radio_button_id = $(this).attr('id');
        $(this).remove();
        container.children('label[for=' + radio_button_id + ']').remove();
      });
    }
    for (var i = 0; i < this.choices.length; i++) {
      // Create the radio button
      var choice_radio_button = $('<input>')
        .attr('id', 'choices-' + i)
        .attr('type', 'checkbox')
        .attr('name', 'choices')
        .attr('value', i)
        .attr('checked', this.selected_answers.includes(i))
        .appendTo(container);

      // Create the label
      var choice_label = $('<label>')
        .text(this.choices[i].content)
        .attr('for', 'choices-' + i)
        .attr('id', 'label-id-' + i)
        .appendTo(container);
    }
    for (let answer of self.selected_answers) {
      if (self.choices[answer].correctness) {
        $('#label-id-' + answer).css({ 'background': '#277547', 'color': '#FAFAFA' });
      } else {
        $('#label-id-' + answer).css({ 'background': '#7B2A29', 'color': '#FAFAFA' });
      }
    }

    // Add a listener for the radio button to change which one the user has clicked on
    $('input[name=choices]').change(function (e) {
      var selected_checkboxes = $('input[name=choices]:checked');
      let selected_checkboxes_values = []
      for (let i = 0; i < selected_checkboxes.length; i++) {
        let index = parseInt(
          selected_checkboxes[i].value.substr(
            selected_checkboxes[i].value.length - 1, 1
          ))
        selected_checkboxes_values.push(index)
      }

      for (let i = 0; i < self.choices.length; i++)
        $('#label-id-' + i).css({ 'background': '#FAE3BB', 'color': 'black' });

      // Change the user choice index
      self.selected_answers = selected_checkboxes_values

      for (let answer of self.selected_answers) {
        if (self.choices[answer].correctness) {
          $('#label-id-' + answer).css({ 'background': '#277547', 'color': '#FAFAFA' });
        } else {
          $('#label-id-' + answer).css({ 'background': '#7B2A29', 'color': '#FAFAFA' });
        }
      }
    });
  }
}


class Quiz {
  constructor(quiz_name, questions) {
    this.quiz_name = quiz_name
    this.questions = questions
  }

  add_question(question) {
    // Randomly choose where to add question
    var index_to_add_question = Math.floor(Math.random() * this.questions.length);
    this.questions.splice(index_to_add_question, 0, question);
  }

  render(container) {
    var self = this;

    // Hide the quiz results modal
    $('#quiz-results').hide();

    // Write the name of the quiz
    $('#quiz-name').text(this.quiz_name);

    // Create a container for questions
    let question_container = $('#question')
    if (question_container.length === 0)
      question_container = $('<div>').attr('id', 'question').insertAfter('#autocomplete')

    // Helper function for changing the question and updating the buttons
    function change_question() {
      self.questions[current_question_index].render(question_container);
      $('#prev-question-button').prop('disabled', current_question_index === 0);
      $('#next-question-button').prop('disabled', current_question_index === self.questions.length - 1);
      $('#index').text(`${current_question_index + 1}/${self.questions.length}`)
    }

    function checkDirection() {
      if (touchendX < touchstartX - 70) {
        console.log(self.questions.length - 1, current_question_index, current_question_index >= self.questions.length - 1)
        if (current_question_index >= self.questions.length - 1) return
        current_question_index++;
        change_question();
      }
      if (touchendX > touchstartX + 70) {
        if (current_question_index <= 0) return
        current_question_index--
        change_question();
      }
    }

    function touchstart(e) {
      touchstartX = e.changedTouches[0].screenX
    }

    function touchend(e) {
      touchendX = e.changedTouches[0].screenX
      checkDirection()
    }

    function autocomplete(inp, arr) {
      /*the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values:*/
      var currentFocus;
      /*execute a function when someone writes in the text field:*/
      'input click'.split(' ').forEach(ename => {
        inp.addEventListener(ename, function (e) {
          var a, b, i, val = this.value;
          /*close any already open lists of autocompleted values*/
          closeAllLists();
          if (!val) { return false; }
          currentFocus = -1;
          /*create a DIV element that will contain the items (values):*/
          a = document.createElement("div");
          a.setAttribute("id", this.id + "autocomplete-list");
          a.setAttribute("class", "autocomplete-items");
          a.style.maxHeight = '200px'
          a.style.overflowY = 'scroll'
          a.style.overflowX = 'hidden'
          /*append the DIV element as a child of the autocomplete container:*/
          this.parentNode.appendChild(a);
          /*for each item in the array...*/
          let kws = val.split(' ')
          for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            let flag_matched = true
            for (let k of kws) if (k.length > 0 && !arr[i].includes(k)) {
              flag_matched = false
              break
            }
            if (!flag_matched) continue

            /*create a DIV element for each matching element:*/
            b = document.createElement("ul")
            /*make the matching letters bold:*/
            let str_with_kwds = arr[i]
            for (let k of kws) if (k.length) str_with_kwds = str_with_kwds.replaceAll(k, `<b>${k}</b>`)
            b.innerHTML = str_with_kwds
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += `<input type='hidden' value='${arr[i]}' idx=${i}>`;
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function (e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
              current_question_index = parseInt(this.getElementsByTagName("input")[0].getAttribute('idx'))
              self.questions[current_question_index].selected_answers = [...Array(self.questions[current_question_index].choices.length).keys()]
              change_question()
            });
            a.appendChild(b);

          }
        });
      })
      /*execute a function presses a key on the keyboard:*/
      inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
      });
      function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
      function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
        closeAllLists(e.target);
      });
    }


    document.ontouchstart = touchstart
    document.ontouchend = touchend

    // Render the first question
    var current_question_index = 0;
    change_question();

    // Add listener for the previous question button
    $('#prev-question-button').click(function () {
      if (current_question_index > 0) {
        current_question_index--;
        change_question();
      }
    });

    // Add listener for the next question button
    $('#next-question-button').click(function () {
      if (current_question_index < self.questions.length - 1) {
        current_question_index++;
        change_question();
      }
    });

    // Add listener for the submit answers button
    $('#submit-button').click(function () {
      // Determine how many questions the user got right
      var score = 0;
      for (var i = 0; i < self.questions.length; i++) {
        if (self.questions[i].user_choice_index.sort().toString() === self.questions[i].correct_choice_indices.sort().toString()) {
          score++;
        }
      }

      // Display the score with the appropriate message
      $('#quiz-results-message').text(message);
      $('#quiz-results-score').html('You got <b>' + score + '/' + self.questions.length + '</b> questions correct.');
      $('#quiz-results').slideDown();
      $('#quiz button').slideUp();
    });

    autocomplete(document.getElementById('myInput'), this.questions.map(x => {
      let choices = ''
      for (let c of x.choices) choices += (c.content + ' ')
      return x.question_string + ' ' + choices
    }))
  }
}

// "Main method" which will create all the objects and render the Quiz.
$(document).ready(function () {
  fetch('./questions.json').then(res => res.json()).then(
    json => {
      console.log(json)
      all_questions = json
      let select = $('#category')
      select.change(function (e) {
        let quiz = create_quiz(select.val())
        var quiz_container = $('#quiz');
        quiz.render(quiz_container);
      })
      for (let qs of all_questions) {
        let category = qs.category
        console.log(category)
        let option = $('<option>')
          .attr('id', 'options-' + category)
          .attr('value', category)
          .text(category)
          .appendTo(select)
      }

      let quiz = create_quiz('all')
      console.log(quiz.questions)

      // Render the quiz
      var quiz_container = $('#quiz');
      quiz.render(quiz_container);
    }
  )

});

function create_quiz(input_category) {
  var quiz = new Quiz('放射防护考试', []);
  for (let categorized_questions of all_questions) {
    let questions = categorized_questions.questions
    let category = categorized_questions.category
    if (input_category != 'all' && input_category != category) continue
    for (let q of questions) {
      // Create a new Question object
      let choices = []
      for (let correct of q.choices.correct)
        choices.push(new Choice(correct, true))
      for (let wrong of q.choices.wrong)
        choices.push(new Choice(wrong, false))
      shuffleArray(choices)
      let type = q.choices.correct.length > 1 ? 'multiple' : 'single'
      let question = new Question(
        q.question_string,
        type,
        choices,
        category,
        'unanswered'
      );

      // Add the question to the instance of the Quiz object that we created previously
      quiz.add_question(question);
    }
  }
  return quiz
}

function random_choice(array, i) {
  var ranNums = [], j = 0;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));
    ranNums.push(array[j]);
    array.splice(j, 1);
  }
  return ranNums
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


