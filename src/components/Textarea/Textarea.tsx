import classNames from 'classnames/bind';
import styles from './Textarea.module.scss';

const cn = classNames.bind(styles);

interface TextareaProps {
  placeholder?: string;
  onChange?: (value: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
}

export default function Textarea({ placeholder = '후기를 작성해 주세요.', onChange, value }: TextareaProps) {
  return (
    <div className={cn('container')}>
      <textarea className={cn('textarea')} placeholder={placeholder} onChange={onChange} value={value} />
    </div>
  );
}
