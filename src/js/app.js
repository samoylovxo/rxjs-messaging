import { from, interval, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';

(() => {
  const url = 'http://localhost:7070';
  const messagesElem = document.querySelector('.messages');

  interval(5000)
    .pipe(
      map(() =>
        from(
          ajax
            .getJSON(`${url}/messages/unread`)
            .pipe(catchError((error) => of(error)))
        )
      )
    )
    .subscribe((observerResponse) => {
      observerResponse.pipe(map((v) => v.messages)).subscribe((response) => {
        if (!response) return;

        messagesElem.innerHTML = '';

        let message;
        response.forEach((msg) => {
          message = `<li class="message">
                            <div class="from">${msg.from}</div>
                            <div class="subject">${
                              msg.subject.length < 15
                                ? msg.subject
                                : `${msg.subject.substring(0, 15)}...`
                            }</div>
                            <div class="received">${msg.received}</div>
                          </li>`;

          messagesElem.insertAdjacentHTML('afterbegin', message);
        });
      });
    });
})();

// .toLocaleDateString()
// .toLocaleTimeString()
