num_word_map = {
    "one": 1, "1": 1,
    "two": 2, "2": 2,
    "three": 3, "3": 3,
    "four": 4, "4": 4,
    "five": 5, "5": 5,
    "six": 6, "6": 6,
    "seven": 7, "7": 7,
    "eight": 8, "8": 8,
    "nine": 9, "9": 9}


def extract_number_from_line(line):
    first_num = None
    last_num = None
    for i in range(len(line)):
        first_offset = 1
        last_offset = 0
        while first_num is None and first_offset <= 6:
            first_num = num_word_map.get(line[i:first_offset+i], None)
            first_offset += 1

        while last_num is None and last_offset <= 6:
            if i == 0:
                last_num = num_word_map.get(line[-i-last_offset:], None)
            else:
                last_num = num_word_map.get(line[-i-1-last_offset:-i], None)

            last_offset += 1

        if first_num is not None and last_num is not None:
            break
    print(f"line = {first_num}{last_num}")
    return first_num * 10 + last_num


def main():
    file = open('../input', 'r')
    total = 0
    for line in file:
        total += extract_number_from_line(line)
    print(f"total: {total}")


if __name__ == '__main__':
    # extract_number_from_line("one2threeaf9s")
    main()
