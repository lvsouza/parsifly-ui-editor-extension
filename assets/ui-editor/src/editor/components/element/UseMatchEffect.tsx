import { type IObservable, observe } from 'react-observing'
import { useCallback, useEffect, useRef } from 'react';


interface IUseMatchEffectProps {
  effect: () => void;
  value?: IObservable<string | undefined>;
  matchWidthValue?: IObservable<string | undefined>;
}
export const useMatchEffect = ({ value: valueObservable, matchWidthValue: matchWitchValueObservable, effect }: IUseMatchEffectProps, deps: readonly any[]) => {
  const observableMatch = useRef(observe(false));


  const handleSet = useCallback((value: boolean) => {
    if (observableMatch.current.value !== value) {
      observableMatch.current.value = value;
    }
  }, []);

  useEffect(() => {
    if (valueObservable === undefined) {
      handleSet(false);
      return;
    }
    if (matchWitchValueObservable === undefined) {
      handleSet(false);
      return;
    }

    handleSet(valueObservable.value === matchWitchValueObservable.value);
  }, [handleSet, valueObservable?.value, matchWitchValueObservable?.value]);

  useEffect(() => {
    if (valueObservable === undefined) return;
    if (matchWitchValueObservable === undefined) return;

    const valueSubscription = valueObservable.subscribe(value => handleSet(value === matchWitchValueObservable.value));
    const matchWitchValueSubscription = matchWitchValueObservable.subscribe(value => handleSet(value === valueObservable.value));

    return () => {
      valueSubscription.unsubscribe();
      matchWitchValueSubscription.unsubscribe();
    };
  }, [handleSet, valueObservable, matchWitchValueObservable]);


  useEffect(() => {
    if (observableMatch.current.value) effect();

    const subscription = observableMatch.current.subscribe(value => {
      if (value) effect();
    });

    return () => subscription.unsubscribe();
  }, [...deps]);
};
