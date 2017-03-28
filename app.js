const Observable = Rx.Observable;

const startButton = document.querySelector('#start');
const halfButton = document.querySelector('#half');
const quaterButton = document.querySelector('#quater');
const stopButton = document.querySelector('#stop');
const resetButton = document.querySelector('#reset');

const input = document.querySelector('#input');

const input$ = Observable.fromEvent(input, 'input').map(event => event.target.value);
const start$ = Observable.fromEvent(startButton, 'click');
const half$ = Observable.fromEvent(halfButton, 'click');
const quater$ = Observable.fromEvent(quaterButton, 'click');
const stop$ = Observable.fromEvent(stopButton, 'click');
const reset$ = Observable.fromEvent(resetButton, 'click');
const data = {count: 0};

const inc = (acc) => ({count: acc.count + 1});
const reset = () => data;

// Observable.fromEvent(startButton, 'click')
//     .subscribe(event => console.log(event));

// Observable.interval(1000)
//     .subscribe(count => console.log(count));

// ______________________________________________________________________

/**
 * switchMap => switches one observable stream to another
 */

// const startInterval$ = start$
//     .switchMapTo(interval$);

// startInterval$
//     .subscribe(x => console.log(x));

// ______________________________________________________________________

/**
 * takeUntil => run stream until some event from another stream appears
 */

// const intervalThatStops$ = interval$
//     .takeUntil(stop$);

// const startInterval$ = start$
//     .switchMapTo(intervalThatStops$);

// startInterval$
//     .subscribe(x => console.log(x));

// ______________________________________________________________________

/**
 * scan => works like reduce
 * transforms data based on prev data
 * 
 * mapTo => maps current value of stream to another value
 */

// const intervalThatStops$ = interval$
//     .takeUntil(stop$);

// start$
//     .switchMapTo(intervalThatStops$)
//     .mapTo(inc)
//     .startWith(data)
//     .scan((acc, current) => current(acc))
//     .subscribe(x => console.log(x));

// ______________________________________________________________________

/**
 * merge => merges to streams into one
 */

// const intervalThatStops$ = interval$
//     .takeUntil(stop$);

// const incOrReset$ = Observable.merge(
//     intervalThatStops$.mapTo(inc), 
//     reset$.mapTo(reset));

// start$
//     .switchMapTo(incOrReset$)
//     .startWith(data)
//     .scan((acc, current) => current(acc))
//     .subscribe(x => console.log(x));

// ______________________________________________________________________

// const starters$ = Observable.merge(
//     start$.mapTo(1000),
//     half$.mapTo(500),
//     quater$.mapTo(250)
// )

// starters$
//     .switchMap((time) => Observable.merge(
//         Observable.interval(time)
//             .takeUntil(stop$).mapTo(inc), 
//         reset$.mapTo(reset)))
//     .startWith(data)
//     .scan((acc, current) => current(acc))
//     .subscribe(x => console.log(x));

// ______________________________________________________________________

/**
 * map => maps strem's value to some new value
 * 
 * Observable.combineLatest, combines streams into one 
 * and the value of new stream would be the latest values of initial sreams
 * 
 * filter => filters the list based on condition
 */

// const starters$ = Observable.merge(
//     start$.mapTo(1000),
//     half$.mapTo(500),
//     quater$.mapTo(250)
// )

// const timer$ = starters$
//     .switchMap((time) => Observable.merge(
//         Observable.interval(time)
//             .takeUntil(stop$).mapTo(inc), 
//         reset$.mapTo(reset)))
//     .startWith(data)
//     .scan((acc, current) => current(acc));

// Observable.combineLatest(
//     timer$,
//     input$,
//     (timer, input) => ({count: timer.count, text: input})
// )
//     .filter(data => data.count === +data.text)
//     .subscribe(x => console.log(x));

// ______________________________________________________________________

/**
 * takeWhile runs the stream while the given condition is true
 * as soon as the condition is false it will stop the stream
 */
// const starters$ = Observable.merge(
//     start$.mapTo(1000),
//     half$.mapTo(500),
//     quater$.mapTo(250)
// )

// const timer$ = starters$
//     .switchMap((time) => Observable.merge(
//         Observable.interval(time)
//             .takeUntil(stop$).mapTo(inc), 
//         reset$.mapTo(reset)))
//     .startWith(data)
//     .scan((acc, current) => current(acc));

// Observable.combineLatest(
//     timer$,
//     input$,
//     (timer, input) => ({count: timer.count, text: input})
// )
//     .takeWhile(data => data.count <= 3)
//     .filter(data => data.count === +data.text)
//     .subscribe(
//         x => console.log(x),
//         err => console.log(`Error! ${err}`),
//         () => console.log('Complete!')
//     );

// ______________________________________________________________________

/**
 * reduce => accumultes all the values in the stream to one single value
 * 
 * do => function that runs outside the stream and dedicated to produce side effects
 */
// const starters$ = Observable.merge(
//     start$.mapTo(1000),
//     half$.mapTo(500),
//     quater$.mapTo(250)
// )

// const timer$ = starters$
//     .switchMap((time) => Observable.merge(
//         Observable.interval(time)
//             .takeUntil(stop$).mapTo(inc), 
//         reset$.mapTo(reset)))
//     .startWith(data)
//     .scan((acc, current) => current(acc));

// Observable.combineLatest(
//     timer$,
//     input$,
//     (timer, input) => ({count: timer.count, text: input})
// )
//     .do(x => console.log(x))
//     .takeWhile(data => data.count <= 3)
//     .filter(data => data.count === +data.text)
//     .reduce((acc, curr) => acc + 1, 0)
//     .subscribe(
//         x => console.log(x),
//         err => console.log(`Error! ${err}`),
//         () => console.log('Complete!')
//     );

// ______________________________________________________________________

/**
 * withLatestFrom => doesn't blocking the compleating of the stream 
 * as combineLatest did.
 * 
 * repeat => re-sibscribes to the event stream
 */
const starters$ = Observable.merge(
    start$.mapTo(1000),
    half$.mapTo(500),
    quater$.mapTo(250)
).share()

const timer$ = starters$
    .switchMap((time) => Observable.merge(
        Observable.interval(time)
            .takeUntil(stop$).mapTo(inc), 
        reset$.mapTo(reset)))
    .startWith(data)
    .scan((acc, current) => current(acc));

const runningGame$ = timer$
    .takeWhile(data => data.count <= 3)
    .withLatestFrom(
        input$,
        (timer, input) => ({count: timer.count, text: input})
    )
    .do(x => console.log(x))
    .share();

starters$
    .subscribe(() => {
        input.focus();
        document.querySelector('#score').innerHTML = '';
        input.value = '';
    })

runningGame$
    .repeat()
    .subscribe(() => input.value = '');

runningGame$
    .filter(data => data.count === +data.text)
    .reduce((acc, curr) => acc + 1, 0)
    .repeat()
    .subscribe(
        x => document.querySelector('#score').innerHTML = `
            ${x}
        `,
        err => console.log(`Error! ${err}`),
        () => console.log('Complete!')
    );

