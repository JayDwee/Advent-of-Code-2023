import re


def main():
    file = open('../input', 'r')
    total = 0
    for line in file:
        first_num = None
        last_num = None
        for i in range(len(line)):
            if first_num is None and re.match(r'\d', line[i]):
                first_num = line[i]
            if last_num is None and re.match(r'\d', line[-i-1]):
                last_num = line[-i-1]
            if first_num is not None and last_num is not None:
                break
        print(f"line = {first_num}{last_num}")
        total += int(first_num+last_num)
    print(f"total: {total}")


if __name__ == '__main__':
    main()
